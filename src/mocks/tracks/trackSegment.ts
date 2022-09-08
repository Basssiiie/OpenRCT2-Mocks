import { Mocker } from "../../core/mocker";

/**
 * Mock that adds additional configurations to the track segment.
 */
export interface TrackSegmentMock extends TrackSegment
{
	subpositions: TrackSubposition[];
}


/**
 * A mock of a track segment.
 * @internal
 */
export function TrackSegmentMocker(template?: Partial<TrackSegmentMock>): TrackSegmentMock
{
	const mock = Mocker<TrackSegmentMock>({
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
			return (this.subpositions) ? this.subpositions.length : 0;
		},
		getSubpositions(): TrackSubposition[]
		{
			return (this.subpositions) ? this.subpositions : [];
		},

		...template,
	});
	return mock;
}