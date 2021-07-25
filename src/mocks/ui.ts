import { Mocker } from "../core/mocker";
import { ViewportMocker } from "./viewport";
import { WindowMock, WindowMocker } from "./window";
import * as ArrayHelper from "../utilities/array";


/**
 * Mock that adds additional configurations to the game map.
 */
export interface UiMock extends Ui
{
	createdWindows: WindowMock[]
}


/**
 * A mock of the user interface api.
 * @internal
 */
export function UiMocker(template?: Partial<UiMock>): UiMock
{
	return Mocker<UiMock>({
		mainViewport: ViewportMocker(),
		createdWindows: [],
		openWindow(desc: WindowDesc): Window
		{
			const window = WindowMocker(desc);
			window.isOpen = true;
			this.createdWindows?.unshift(window);
			return window;
		},
		closeWindows(classification: string, id?: number): void
		{
			this.createdWindows
				?.filter(w => w.classificationName === classification
					&& (id === undefined || id === w.number))
				.forEach(w =>
				{
					w.onClose?.();
					w.isOpen = false;
				});
		},
		getWindow(id: string | number): Window
		{
			const window = ArrayHelper.tryFind(this.createdWindows, w => w.classificationName === id || w.classification === id);
			if (!window)
				return <Window><unknown>null;

			return window as Window;
		},

		...template,
	});
}