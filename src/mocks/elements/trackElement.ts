import { Mocker } from "../../core/mocker";
import { TileElementMocker } from "./tileElement";


/**
 * A mock of a surface tile element.
 * @internal
 */
export function TrackElementMocker(template?: Partial<TrackElement>): TrackElement
{
	const mock = Mocker<TrackElement>({
		direction: 0,
		trackType: 0,
		rideType: 0,
		sequence: 0,
		mazeEntry: null,
		colourScheme: 0,
		seatRotation: 0,
		ride: 0,
		station: null,
		brakeBoosterSpeed: 0,
		hasChainLift: false,
		isInverted: false,
		hasCableLift: false,
		isHighlighted: false,

		...(TileElementMocker(template) as Partial<BaseTileElement>),
		type: "track",
	});

	return mock;
}