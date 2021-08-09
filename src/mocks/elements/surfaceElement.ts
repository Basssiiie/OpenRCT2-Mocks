import { Mocker } from "../../core/mocker";
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
	if (!("hasOwnership" in mock)) // If 'hasOwnership' is not set, get it from 'ownership'.
	{
		Object.defineProperty(mock, "hasOwnership", {
			configurable: true, enumerable: true,
			get: () => !!(mock.ownership & Ownership.Owned)
		});
	}
	if (!("hasConstructionRights" in mock)) // If 'hasConstructionRights' is not set, get it from 'ownership'.
	{
		Object.defineProperty(mock, "hasConstructionRights", {
			configurable: true, enumerable: true,
			get: () => !!(mock.ownership & (Ownership.Owned | Ownership.ConstructionRightsOwned))
		});
	}
	return mock;
}