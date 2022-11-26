import { Mocker } from "./core/mocker";
import { MockTemplate } from "./core/mockTemplate";
import { ContextMock, ContextMocker } from "./mocks/context";
import { SurfaceElementMocker } from "./mocks/elements/surfaceElement";
import { TileElementMocker } from "./mocks/elements/tileElement";
import { TrackElementMocker } from "./mocks/elements/trackElement";
import { CarMock, CarMocker } from "./mocks/entities/car";
import { EntityMocker } from "./mocks/entities/entity";
import { GuestMock, GuestMocker } from "./mocks/entities/guest";
import { PeepMock } from "./mocks/entities/peep";
import { StaffMock, StaffMocker } from "./mocks/entities/staff";
import { GameDateMocker } from "./mocks/gameDate";
import { GameMapMock, GameMapMocker } from "./mocks/gameMap";
import { NetworkMock, NetworkMocker } from "./mocks/network/network";
import { PlayerMock, PlayerMocker } from "./mocks/network/player";
import { PlayerGroupMock, PlayerGroupMocker } from "./mocks/network/playerGroup";
import { LoadedObjectMocker } from "./mocks/objects/loadedObject";
import { RideObjectMocker } from "./mocks/objects/rideObject";
import { RideObjectVehicleMock } from "./mocks/objects/rideObjectVehicle";
import { ParkMock, ParkMocker } from "./mocks/park";
import { RideMocker } from "./mocks/ride";
import { TileMocker } from "./mocks/tile";
import { TrackIteratorMock, TrackIteratorMocker, TrackPieceMock } from "./mocks/tracks/trackIterator";
import { TrackSegmentMock, TrackSegmentMocker } from "./mocks/tracks/trackSegment";
import { UiMock, UiMocker } from "./mocks/ui/ui";
import { ViewportMocker } from "./mocks/ui/viewport";
import { WindowMock, WindowMocker } from "./mocks/ui/window";


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
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * Inherits everything from the {@link Mock.entity|`entity`} mock.
	 *  * `type` is set to `car`.
	 *  * `travelBy` updates `remainingDistance` and `trackProgress`.
	 *  * Various `number` properties map to values on matching object from `context.getObject`
	 *    if `rideObject` and `vehicleObject` are present.
	 */
	car: MockTemplate<CarMock>;

	/**
	 * Create a mock of an OpenRCT2 context.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `getObject` and `getAllObjects` query the `objects` array.
	 *  * `registerAction` maps to the `registeredActions` array.
	 *  * `subscribe` maps to the `subscriptions` property.
	 *  * `queryAction` and `executeAction` will trigger any actions in the `registeredActions` and `subscriptions` arrays.
	 *  * `getRandom` always returns `min` by default.
	 */
	context: MockTemplate<ContextMock>;

	/**
	 * Create a mock of an OpenRCT2 date object.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `ticksElapsed`, `monthsElapsed` and `monthProgress` is set to 0.
	 *  * `yearsElapsed`, `year` and `month` are calculated from `monthsElapsed`.
	 *  * `day` is calculated from `monthProgress` and influenced by `month`.
	 */
	date: MockTemplate<GameDate>;

	/**
	 * Create a mock of an OpenRCT2 entity.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `id` is assigned an unique number.
	 */
	entity: MockTemplate<Entity>;

	/**
	 * Create a mock of an OpenRCT2 guest.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * Inherits everything from the {@link Mock.entity|`entity`} mock.
	 *  * `type` and `peepType` are set to `"guest"`.
	 *  * `getFlag` and `setFlag` map to the `flags` property.
	 *  * `isInPark` is set to `true` to reflect the most common scenario.
	 *  * `isLost` checks if `lostCountdown` is lower than 90 or not.
	 */
	guest: MockTemplate<GuestMock>;

	/**
	 * Create a mock of an OpenRCT2 loaded object.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `index` is assigned an unique number.
	 */
	loadedObject: MockTemplate<LoadedObject>;

	/**
	 * Create a mock of an OpenRCT2 map.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `numEntities` maps to the length of the `entities` array.
	 *  * `numRides` maps to the length of the `rides` array.
	 *  * `getEntity` and `getAllEntities` query the `entities` array.
	 *  * `getRide` queries the `rides` array.
	 *  * `getTile` maps to `tiles`, or queries it if it is an array.
	 *  * `getTrackIterator` tries to use the element positional information from `getTile()`.
	 */
	map: MockTemplate<GameMapMock>;

	/**
	 * Create a mock of the OpenRCT2 network system.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `numPlayers`, `getPlayer` and `kickPlayer` map to the `players` property.
	 *  * `numGroups`, `addGroup`, `getGroup` and `removeGroup` map to the `groups` property.
	 *  * `players` and `groups` are initialised with one default player or group.
	 */
	network: MockTemplate<NetworkMock>;

	/**
	 * Create a mock of an OpenRCT2 park.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `getFlag` and `setFlag` map to the `flags` property.
	 *  * `guests` maps to the total of guests that are in the park from `map.getAllEntities("guest")`.
	 *    If `map` is not defined, it returns 0.
	 */
	park: MockTemplate<ParkMock>;

	/**
	 * Create a mock of an OpenRCT2 player in a multiplayer game.
	 */
	player: MockTemplate<PlayerMock>;

	/**
	 * Create a mock of an OpenRCT2 player group in a multiplayer game.
	 */
	playerGroup: MockTemplate<PlayerGroupMock>;

	/**
	 * Create a mock of an OpenRCT2 ride.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `id` is assigned an unique number.
	 *  * `classification` is set to `"ride"`.
	 *  * `object` maps to `context.getObject` with matching `objectId` if `context`
	 *    is defined.
	 */
	ride: MockTemplate<Ride>;

	/**
	 * Create a mock of an OpenRCT2 ride object.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * Inherits everything from the {@link Mock.loadedObject|`loadedObject`} mock.
	 *  * `type` is set to `"ride"`.
	 *  * `carsPerFlagRide` is set to 255 (standard for tracked rides).
	 *  * `vehicles` contains one mocked {@link Mock.rideObjectVehicle|`rideObjectVehicle`}.
	 */
	rideObject: MockTemplate<RideObject>;

	/**
	 * Create a mock of an OpenRCT2 ride object's vehicle.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `baseImageId` is assigned an unique number.
	 */
	rideObjectVehicle: MockTemplate<RideObjectVehicle>;

	/**
	 * Create a mock of an OpenRCT2 staff.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * Inherits everything from the {@link Mock.entity|`entity`} mock.
	 *  * `type` and `peepType` are set to `"staff"`.
	 *  * `getFlag` and `setFlag` map to the `flags` property.
	 */
	staff: MockTemplate<StaffMock>;

	/**
	 * Create a mock of an OpenRCT2 surface tile element.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `type` is always set to `"surface"`.
	 *  * `hasOwnership` and `hasConstructionRights` map to `ownership`.
	 *  * All properties returning a `number` are set to 0.
	 */
	surface: MockTemplate<SurfaceElement>;

	/**
	 * Create a mock of an OpenRCT2 tile.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `getElement`, `insertElement`, `removeElement` and `numElements` map to the `elements` array.
	 *  * `elements` contains a single mocked {@link Mock.surface|`surface`} tile element.
	 */
	tile: MockTemplate<Tile>;

	/**
	 * Create a mock of an OpenRCT2 tile element.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `baseHeight` and `clearanceHeight` will return the value of `baseZ` and `clearanceZ` times 8 respectively, if set.
	 *  * `baseZ` and `clearanceZ` will return the value of `baseHeight` and `clearanceHeight` integer divided by 8 respectively, if set.
	 */
	tileElement: MockTemplate<TileElement>;

	/**
	 * Create a mock of an OpenRCT2 track element.
	 */
	trackElement: MockTemplate<TrackElement>;

	/**
	 * Create a mock of an OpenRCT2 track iterator.
	 *  * `position`, `nextPosition`, `previousPosition` map to the `trackPieces` array based on `trackPieceIndex`.
	 *  * `segment` maps to the `segments` array based on the `trackType` in the `trackPieces` array.
	 *  * `next` and `previous` increment and decrement `trackPieceIndex` respectively.
	 */
	trackIterator: MockTemplate<TrackIteratorMock>;

	/**
	 * Create a mock of an OpenRCT2 track segment.
	 *  * `getSubpositionLength` and `getSubpositions` map to the `subpositions` array.
	 */
	trackSegment: MockTemplate<TrackSegmentMock>;

	/**
	 * Create a mock of an OpenRCT2 user interface context.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `openWindow`, `closeWindows` and `getWindow` map to the `createdWindows` array.
	 *  * `mainViewport` is set to a mocked {@link Mock.viewport|`viewport`}.
	 */
	ui: MockTemplate<UiMock>;

	/**
	 * Create a mock of an OpenRCT2 viewport widget.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `getCentrePosition` returns the center position of `top`, `bottom`, `left` and `right`.
	 *  * `moveTo` and `scrollTo` updates `top`, `bottom`, `left` and `right`.
	 *  * The default viewport size reflected in the properties is 100x100.
	 */
	viewport: MockTemplate<Viewport>;

	/**
	 * Create a mock of an OpenRCT2 window.
	 *
	 * Auto-mocks the following members if they are not set on the given template:
	 *  * `findWidget` queries the `widgets` array.
	 *  * `classificationName` maps to the original string based classification, if it was specified.
	 *  * `widgets` returns widgets from the currently selected tab concatenated to its end.
	 *  * `close` will trigger the `onClose` event if specified.
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
	date: GameDateMocker,
	entity: EntityMocker,
	guest: GuestMocker,
	loadedObject: LoadedObjectMocker,
	map: GameMapMocker,
	network: NetworkMocker,
	park: ParkMocker,
	player: PlayerMocker,
	playerGroup: PlayerGroupMocker,
	ride: RideMocker,
	rideObject: RideObjectMocker,
	rideObjectVehicle: RideObjectVehicleMock,
	staff: StaffMocker,
	surface: SurfaceElementMocker,
	tile: TileMocker,
	tileElement: TileElementMocker,
	trackElement: TrackElementMocker,
	trackIterator: TrackIteratorMocker,
	trackSegment: TrackSegmentMocker,
	ui: UiMocker,
	viewport: ViewportMocker,
	window: WindowMocker,
});


export default Mock;
export type { ContextMock, GameMapMock, GuestMock, NetworkMock, ParkMock, PlayerMock, PlayerGroupMock, PeepMock, StaffMock, TrackIteratorMock, TrackPieceMock, TrackSegmentMock, UiMock, WindowMock };
