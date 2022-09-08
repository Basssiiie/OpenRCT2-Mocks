import { Mocker } from "../../core/mocker";
import { tryAddGet } from "../../utilities/object";
import { TileElementMocker } from "./tileElement";


/**
 * Ownership values as used by OpenRCT2.
 */
const enum Ownership
{
	Unowned = 0,
    ConstructionRightsOwned = (1 << 4),
    Owned = (1 << 5),
    ConstructionRightsAvailable = (1 << 6),
    Available = (1 << 7)
}


/**
 * A mock of a surface tile element.
 * @internal
 */
export function SurfaceElementMocker(template?: Partial<SurfaceElement>): SurfaceElement
{
	const mock = Mocker<SurfaceElement>({
		slope: 0,
		surfaceStyle: 0,
		edgeStyle: 0,
		waterHeight: 0,
		grassLength: 0,
		ownership: 0,
		parkFences: 0,

		...(TileElementMocker(template) as Partial<BaseTileElement>),
		type: "surface",
	});
	tryAddGet(mock, "hasOwnership", () => !!(mock.ownership & Ownership.Owned));
	tryAddGet(mock, "hasConstructionRights", () => !!(mock.ownership & (Ownership.Owned | Ownership.ConstructionRightsOwned)));

	return mock;
}