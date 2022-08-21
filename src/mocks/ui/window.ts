import { Mocker } from "../../core/mocker";
import * as ArrayHelper from "../../utilities/array";


/**
 * Mock that adds additional configurations to the window.
 */
export interface WindowMock extends Window
{
	/**
	 * The original classification name, if it was specified for the window description.
	 */
	classificationName: string;

	/**
	 * Whether the window is currently open or not.
	 */
	isOpen: boolean;

	onClose?: () => void;
	onUpdate?: () => void;
	onTabChange?: () => void;
}


/**
 * A mock of a window with basic functionality.
 * @internal
 */
export function WindowMocker(template?: Partial<Window | WindowDesc>): WindowMock
{
	let classId: number | undefined = undefined,
		className: string | undefined = undefined;

	if (template)
	{
		// Fix inconsistencies between number and string classification fields.
		if (template.classification)
		{
			const classValue: unknown = template.classification;
			const classType = typeof classValue;
			if (classType === "string")
			{
				className = classValue as string;
			}
			else if (classType === "number")
			{
				classId = classValue as number;
			}
		}
	}

	if ((template as WindowDesc).tabs)
	{
		const wd = template as WindowDesc;
		const tabIndex = wd.tabIndex || 0;
		// check for widgets in tab
		if (wd.tabs?.length && wd.tabs[tabIndex])
		{
			//safely add the widgets in the tab into wd.widgets[]
			const tabWidgets = wd.tabs[tabIndex].widgets as Widget[];
			(wd.widgets && wd.widgets.length > 0) ? wd.widgets.push(...tabWidgets) : wd.widgets = tabWidgets;
		}
	}



	return Mocker<WindowMock>({
		classificationName: className,
		findWidget<T extends Widget>(name: string): T
		{
			const result = ArrayHelper.tryFind(this.widgets, w => w.name === name);
			if (!result)
				throw new Error(`Widget not found: '${name}'`);

			return result as T;
		},
		bringToFront(): void
		{
			// Do nothing
		},
		close(): void
		{
			this.isOpen = false;
		},

		...template,
		classification: classId,
	});
}
