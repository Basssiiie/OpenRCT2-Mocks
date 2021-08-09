import { Mocker } from "./core/mocker";
import { MockTemplate } from "./core/mockTemplate";
import { CarMock, CarMocker } from "./mocks/car";
import { ContextMock, ContextMocker } from "./mocks/context";
import { EntityMocker } from "./mocks/entity";
import { GameMapMock, GameMapMocker } from "./mocks/gameMap";
import { GuestMock, GuestMocker } from "./mocks/guest";
import { LoadedObjectMocker } from "./mocks/loadedObject";
import { ParkMock, ParkMocker } from "./mocks/park";
import { PeepMock, PeepMocker } from "./mocks/peep";
import { RideMocker } from "./mocks/ride";
import { RideObjectMocker } from "./mocks/rideObject";
import { RideObjectVehicleMock } from "./mocks/rideObjectVehicle";
import { StaffMock, StaffMocker } from "./mocks/staff";
import { SurfaceElementMocker } from "./mocks/surfaceElement";
import { TileMocker } from "./mocks/tile";
import { TileElementMocker } from "./mocks/tileElement";
import { UiMock, UiMocker } from "./mocks/ui";
import { ViewportMocker } from "./mocks/viewport";
import { WindowMock, WindowMocker } from "./mocks/window";


/**
 * Mock is an easy to use utility to help create mocks for well known OpenRCT2
 * interfaces. Each mock allows passing in a base template to set specific
 * values for your unit tests.
 *
 * Some general notes:
 *  * Some members will be auto-mocked with basic functionality if not supplied
 *     through the template.
 *  * Some templates have additional storage properties to supply specific internal
 *     objects which are normally only accesible through the interface's methods.
 *  * Members that return interfaces, will return default mocks if not supplied
 *     through the template.
 */
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
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `id` is assigned an unique number.
	 */
	entity: MockTemplate<Entity>;

	/**
	 * Create a mock of an OpenRCT2 guest.
	 */
	guest: MockTemplate<GuestMock>;

	/**
	 * Create a mock of an OpenRCT2 loaded object.
	 */
	loadedObject: MockTemplate<LoadedObject>;

	/**
	 * Create a mock of an OpenRCT2 map.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `numEntities` maps to the length of the `entities` array.
	 *  * `numRides` maps to the length of the `rides` array.
	 *  * `getAllEntities` and `getEntity` query the `entities` array.
	 *  * `getRide` queries the `rides` array.
	 *  * `getTile` maps to `tiles`, or queries it if it is an array.
	 */
	map: MockTemplate<GameMapMock>;

	/**
	 * Create a mock of an OpenRCT2 park.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `getFlag` and `setFlag` to the `flags` property.
	 *  * `guests` to `map.getAllEntities` and counts the peeps that are guests.
	 *    If `map` is not defined, it returns 0.
	 */
	park: MockTemplate<ParkMock>;

	/**
	 * Create a mock of an OpenRCT2 peep.
	 */
	peep: MockTemplate<PeepMock>;

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
	 * Create a mock of an OpenRCT2 staff.
	 */
	staff: MockTemplate<StaffMock>;

	/**
	 * Create a mock of an OpenRCT2 surface tile element.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `type` is always set to `surface`.
	 *  * `hasOwnership` and `hasConstructionRights` map to `ownership`.
	 *  * All properties returning a `number` are set to 0.
	 */
	surface: MockTemplate<SurfaceElement>;

	/**
	 * Create a mock of an OpenRCT2 tile.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `getElement`, `insertElement`, `removeElement` and `numElements` map to the `elements` array.
	 *  * `elements` contains a single `surface` tile element mock.
	 */
	tile: MockTemplate<Tile>;

	/**
	 * Create a mock of an OpenRCT2 tile element.
	 */
	tileElement: MockTemplate<TileElement>;

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
	guest: GuestMocker,
	loadedObject: LoadedObjectMocker,
	map: GameMapMocker,
	park: ParkMocker,
	peep: PeepMocker,
	ride: RideMocker,
	rideObject: RideObjectMocker,
	rideObjectVehicle: RideObjectVehicleMock,
	staff: StaffMocker,
	surface: SurfaceElementMocker,
	tile: TileMocker,
	tileElement: TileElementMocker,
	ui: UiMocker,
	viewport: ViewportMocker,
	window: WindowMocker,
});


export default Mock;
export type { ContextMock, GameMapMock, GuestMock, ParkMock, PeepMock, StaffMock, UiMock, WindowMock };