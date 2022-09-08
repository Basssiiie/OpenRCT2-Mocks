import { Mocker } from "../core/mocker";
import { tryAddGet } from "../utilities/object";
import { SurfaceElementMocker } from "./elements/surfaceElement";
import { TileElementMocker } from "./elements/tileElement";


/**
 * Mock that adds additional configurations to the tile.
 */
interface TileMock extends Tile
{
	elements: TileElement[];
}


/**
 * A mock of an tile.
 * @internal
 */
export function TileMocker(template?: Partial<Tile>): Tile
{
	const mock = Mocker<TileMock>({
		elements: [ // = a default property
			SurfaceElementMocker()
		],
		getElement(index: number)
		{
			if (!this.elements || index < 0 || index >= this.elements.length)
				return TileElementMocker();

			return this.elements[index];
		},
		insertElement(index: number)
		{
			const element = TileElementMocker();
			if (this.elements)
			{
				this.elements.splice(index, 0, element);
			}
			else
			{
				this.elements = [ element ];
			}
			return element;
		},
		removeElement(index: number)
		{
			if (this.elements)
			{
				this.elements.splice(index, 1);
			}
		},

		...template,
	});
	// Calculate from 'elements' list if not set.
	tryAddGet(mock, "numElements", () => (mock.elements) ? mock.elements.length : 0);
	return mock;
}