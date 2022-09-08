import { Mocker } from "../../core/mocker";
import { tryAddGet } from "../../utilities/object";
import { CoordsMock } from "../coords";
import { TrackSegmentMocker } from "./trackSegment";


/**
 * A mock of a track iterator.
 * @internal
 */
export function TrackIteratorMocker(template?: Partial<TrackIterator>): TrackIterator
{
	const mock = Mocker<TrackIterator>({
		position: CoordsMock(),
		previousPosition: CoordsMock(),
		nextPosition: CoordsMock(),
		next()
		{
			return true;
		},
		previous()
		{
			return true;
		},

		...template,
	});
	tryAddGet(mock, "segment", () => TrackSegmentMocker());
	return mock;
}