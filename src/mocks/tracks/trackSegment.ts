import { Mocker } from "../../core/mocker";


/**
 * A mock of a track segment.
 * @internal
 */
export function TrackSegmentMocker(template?: Partial<TrackSegment>): TrackSegment
{
	const mock = Mocker<TrackSegment>({
		type: 0,
		description: "",
		beginZ: 0,
		beginDirection: 0,
		beginAngle: 0,
		beginBank: 0,
		endX: 0,
		endY: 0,
		endZ: 0,
		endDirection: 0,
		endAngle: 0,
		length: 0,
		elements: [],
		getSubpositionLength(): number
		{
			return 0;
		},
		getSubpositions(): TrackSubposition[]
		{
			return [];
		},

		...template,
	});
	return mock;
}