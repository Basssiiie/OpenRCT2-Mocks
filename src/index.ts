import { Mocker } from "./core/mocker";
import { MockTemplate } from "./core/mockTemplate";
import { CarMock, CarMocker } from "./mocks/car";
import { ContextMock, ContextMocker } from "./mocks/context";
import { EntityMocker } from "./mocks/entity";
import { GameMapMock, GameMapMocker } from "./mocks/gameMap";
import { LoadedObjectMocker } from "./mocks/loadedObject";
import { ParkMock, ParkMocker } from "./mocks/park";
import { RideMocker } from "./mocks/ride";
import { RideObjectMocker } from "./mocks/rideObject";
import { RideObjectVehicleMock } from "./mocks/rideObjectVehicle";
import { UiMock, UiMocker } from "./mocks/ui";
import { ViewportMocker } from "./mocks/viewport";
import { WindowMock, WindowMocker } from "./mocks/window";


export interface Mock
{
	/**
	 * Allows creating a (partial) mock of the specified type or interface.
	 *
	 * @param source A partial of T containing the mocked methods and values.
	 * @returns The specified partial as a fully typed T.
	 */
	<T>(source?: Partial<T>): T;

	/**
	 * Create a mock of an OpenRCT2 car entity.
	 */
	car: MockTemplate<CarMock>;

	/**
	 * Create a mock of an OpenRCT2 context.
	 */
	context: MockTemplate<ContextMock>;

	/**
	 * Create a mock of an OpenRCT2 entity.
	 */
	entity: MockTemplate<Entity>;

	/**
	 * Create a mock of an OpenRCT2 loaded object.
	 */
	loadedObject: MockTemplate<LoadedObject>;

	/**
	 * Create a mock of an OpenRCT2 map.
	 */
	map: MockTemplate<GameMapMock>;

	/**
	 * Create a mock of an OpenRCT2 park.
	 */
	park: MockTemplate<ParkMock>;

	/**
	 * Create a mock of an OpenRCT2 ride.
	 */
	ride: MockTemplate<Ride>;

	/**
	 * Create a mock of an OpenRCT2 ride object.
	 */
	rideObject: MockTemplate<RideObject>;

	/**
	 * Create a mock of an OpenRCT2 ride object's vehicle.
	 */
	rideObjectVehicle: MockTemplate<RideObjectVehicle>;

	/**
	 * Create a mock of an OpenRCT2 user interface context.
	 */
	ui: MockTemplate<UiMock>;

	/**
	 * Create a mock of an OpenRCT2 viewport widget.
	 */
	viewport: MockTemplate<Viewport>;

	/**
	 * Create a mock of an OpenRCT2 window.
	 */
	window: MockTemplate<WindowMock>;
}


/**
 * Helper that can create mocks.
 */
const Mock: Mock = Object.assign(Mocker,
{
	car: CarMocker,
	context: ContextMocker,
	entity: EntityMocker,
	loadedObject: LoadedObjectMocker,
	map: GameMapMocker,
	park: ParkMocker,
	ride: RideMocker,
	rideObject: RideObjectMocker,
	rideObjectVehicle: RideObjectVehicleMock,
	ui: UiMocker,
	viewport: ViewportMocker,
	window: WindowMocker,
});


export { ContextMock, GameMapMock, ParkMock, UiMock, WindowMock };
export default Mock;