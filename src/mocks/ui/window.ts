import { Mocker } from "../../core/mocker";
import * as ArrayHelper from "../../utilities/array";


let windowNumber = 0;


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
		className: string | undefined = undefined,
		templateWidgets: Widget[] | undefined;

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
		templateWidgets = template.widgets;
	}

	const mock = Mocker<WindowMock>({
		classificationName: className,
		number: windowNumber++,
		tabIndex: 0,
		findWidget<T extends Widget>(name: string): T
		{
			return <T>(ArrayHelper.tryFind(this.widgets, w => w.name === name) || <unknown>null);
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
		classification: classId ?? 225, // custom windows are always 225
		get widgets(): Widget[] | undefined
		{
			const widgets = templateWidgets || [];
			const tabWidgets = (template && "tabs" in template && template.tabs) ? template.tabs[template.tabIndex || 0]?.widgets : undefined;
			return (tabWidgets) ? widgets.concat(tabWidgets) : widgets;
		}
	});
	return mock;
}