import { Mocker } from "../../core/mocker";
import { ViewportMocker } from "./viewport";
import { WindowMock, WindowMocker } from "./window";
import * as ArrayHelper from "../../utilities/array";


/**
 * Mock that adds additional configurations to the user interface api.
 */
export interface UiMock extends Ui
{
	/**
	 * Keeps track of all windows that have been created, with the most recently created
	 * windows inserted at the front.
	 */
	createdWindows: WindowMock[];
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
			if (this.createdWindows)
			{
				this.createdWindows.unshift(window);
			}
			return window;
		},
		closeAllWindows(): void
		{
			if (!this.createdWindows)
				return;

			this.createdWindows.forEach(w =>
			{
				w.onClose?.();
				w.isOpen = false;
			});
		},
		closeWindows(classification: string, id?: number): void
		{
			if (!this.createdWindows)
				return;

			this.createdWindows
				.filter(w => w.classificationName === classification
					&& (id === undefined || id === w.number))
				.forEach(w =>
				{
					w.onClose?.();
					w.isOpen = false;
				});
		},
		getWindow(id: string | number): Window
		{
			return ArrayHelper.tryFind(this.createdWindows, w => w.classificationName === id || w.classification === id)
				|| <Window><unknown>null;
		},

		...template,
	});
}
