import { Mocker } from "../core/mocker";
import { TileElementMocker } from "./tileElement";


/**
 * A mock of an tile.
 * @internal
 */
export function TileMocker(template?: Partial<Tile>): Tile
{
	const mock = Mocker({
		getElement(index: number)
		{
			if (!this.elements || this.elements.length >= index)
				throw Error(`Unknown element index '${index}'; it is outside of the bounds of the 'elements' list on the 'tile' mock.`);

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
	if (!("numElements" in mock)) // Calculate from 'elements' list if not set.
	{
		Object.defineProperty(mock, "numElements", {
			configurable: true, enumerable: true,
			get: () => (mock.elements) ? mock.elements.length : 0
		});
	}
	return mock;
}