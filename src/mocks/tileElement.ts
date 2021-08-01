import { Mocker } from "../core/mocker";


/**
 * A mock of an tile element.
 * @internal
 */
export function TileElementMocker(template?: Partial<TileElement>): TileElement
{
	return Mocker({
		...template
	});
}