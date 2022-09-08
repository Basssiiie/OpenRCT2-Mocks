import { Mocker } from "../../core/mocker";
import { tryAddGet } from "../../utilities/object";
import { CoordsMock } from "../coords";
import { TrackSegmentMocker } from "./trackSegment";


/**
 * Mock that adds additional configurations to the track iterator.
 */
export interface TrackIteratorMock extends TrackIterator
{
	segments: TrackSegment[];
	segmentIndex: number;
}


/**
 * A mock of a track iterator.
 * @internal
 */
export function TrackIteratorMocker(template?: Partial<TrackIteratorMock>): TrackIteratorMock
{
	const mock = Mocker<TrackIteratorMock>({
		segmentIndex: 0,
		position: CoordsMock(),
		previousPosition: CoordsMock(),
		nextPosition: CoordsMock(),
		next()
		{
			if (this.segmentIndex !== undefined)
			{
				this.segmentIndex++;
			}
			return true;
		},
		previous()
		{
			if (this.segmentIndex !== undefined)
			{
				this.segmentIndex--;
			}
			return true;
		},

		...template,
	});
	tryAddGet(mock, "segment", () => (mock.segments) ? mock.segments[mock.segmentIndex] : TrackSegmentMocker());
	return mock;
}