import { Mocker } from "../../core/mocker";


/**
 * A mock of an tile element.
 * @internal
 */
export function TileElementMocker(template?: Partial<TileElement>): TileElement
{
	return Mocker<TileElement>({
		baseHeight: 0,
		baseZ: 0,
		clearanceHeight: 0,
		clearanceZ: 0,
		occupiedQuadrants: 0,
		isGhost: false,
		isHidden: false,

		...template
	});
}