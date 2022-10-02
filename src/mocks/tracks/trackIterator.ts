import { Mocker } from "../../core/mocker";
import { tryAddGet } from "../../utilities/object";
import { CoordsMock } from "../coords";
import { TrackSegmentMocker } from "./trackSegment";


/**
 * A mock for a track piece that can be used to help setting up a testable track iterator.
 */
export interface TrackPieceMock
{
	location: CoordsXYZD;
	trackType: number;
	subposition: number;
}


/**
 * Mock that adds additional configurations to the track iterator.
 */
export interface TrackIteratorMock extends TrackIterator
{
	segments: TrackSegment[];
	trackPieces: Partial<TrackPieceMock>[];
	trackPieceIndex: number;
}


/**
 * A mock of a track iterator.
 * @internal
 */
export function TrackIteratorMocker(template?: Partial<TrackIteratorMock>): TrackIteratorMock
{
	const mock = Mocker<TrackIteratorMock>({
		trackPieceIndex: 0,
		next()
		{
			let idx = this.trackPieceIndex;
			if (idx === undefined)
			{
				return true;
			}
			const pieces = this.trackPieces;
			if (pieces && (++idx) === pieces.length)
			{
				return false;
			}
			this.trackPieceIndex = idx;
			return true;
		},
		previous()
		{
			const idx = this.trackPieceIndex;
			if (idx === undefined)
			{
				return true;
			}
			const pieces = this.trackPieces;
			if (pieces && idx === 0)
			{
				return false;
			}
			this.trackPieceIndex = (idx - 1);
			return true;
		},

		...template,
	});
	tryAddGet(mock, "position", () => getTrackPositionAt(mock, mock.trackPieceIndex) || CoordsMock());
	tryAddGet(mock, "nextPosition", () => getTrackPositionAt(mock, mock.trackPieceIndex + 1));
	tryAddGet(mock, "previousPosition", () => getTrackPositionAt(mock, mock.trackPieceIndex - 1));
	tryAddGet(mock, "segment", () =>
	{
		const piece = getTrackPiece(mock, mock.trackPieceIndex);
		if (!mock.segments || mock.segments.length === 0)
		{
			return TrackSegmentMocker({ type: piece?.trackType });
		}
		return (piece && mock.segments && mock.segments.find(s => s.type == piece.trackType)) || null;
	});
	return mock;
}


function getTrackPiece(mock: TrackIteratorMock, index: number | undefined): Partial<TrackPieceMock> | undefined
{
	const pieces = mock.trackPieces;
	return (index !== undefined && pieces && pieces[index]) || undefined;
}


function getTrackPositionAt(mock: TrackIteratorMock, index: number | undefined): CoordsXYZD | null
{
	if (mock.trackPieces.length === 0)
	{
		return CoordsMock();
	}

	const piece = getTrackPiece(mock, index);
	return (piece && piece.location) || null;
}