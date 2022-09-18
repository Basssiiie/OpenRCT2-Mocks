import { Mocker } from "../../core/mocker";
import { isGetter, tryAddGet } from "../../utilities/object";


const convertZToHeight = 8;


/**
 * A mock of an tile element.
 * @internal
 */
export function TileElementMocker(template?: Partial<TileElement>): TileElement
{
	const mock = Mocker<TileElement>({
		occupiedQuadrants: 0,
		isGhost: false,
		isHidden: false,

		...template
	});
	tryAddGet(mock, "baseHeight", () => Math.floor(getIfSet(mock, "baseZ") / convertZToHeight));
	tryAddGet(mock, "baseZ", () => getIfSet(mock, "baseHeight") * convertZToHeight);
	tryAddGet(mock, "clearanceHeight", () => Math.floor(getIfSet(mock, "clearanceZ") / convertZToHeight));
	tryAddGet(mock, "clearanceZ", () => getIfSet(mock, "clearanceHeight") * convertZToHeight);

	return mock;
}


function getIfSet(mock: TileElement, key: keyof TileElement): number
{
	return isGetter(mock, key) ? 0 : <number>mock[key];
}