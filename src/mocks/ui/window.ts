import { Mocker } from "../../core/mocker";
import * as ArrayHelper from "../../utilities/array";
import { addGet, clone } from "../../utilities/object";
import { Mutable } from "../../utilities/mutable";
import { ViewportMocker } from "./viewport";


let windowNumber = 0;


/**
 * Mock that adds additional configurations to the window.
 */
export interface WindowMock extends Window, Pick<WindowDesc, "tabs" | "onClose" | "onUpdate" | "onTabChange">
{
	/**
	 * The original classification name, if it was specified for the window description.
	 */
	classificationName: string;

	/**
	 * Whether the window is currently open or not.
	 */
	isOpen: boolean;
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
			this.onClose?.();
		},

		...template,
		classification: classId ?? 225, // custom windows are always 225
		widgets: undefined
	});
	if (template)
	{
		templateWidgets = cloneAndPolyfillWidgets(mock, template.widgets);
		if ("tabs" in template)
		{
			mock.tabs = cloneAndPolyfillTabs(mock, template.tabs);
		}
	}
	addGet(mock, "widgets", function(this: WindowMock): Widget[] // overwrite widgets on mock
	{
		const widgets = templateWidgets || [];
		const tabWidgets = ("tabs" in this && this.tabs) ? this.tabs[this.tabIndex || 0]?.widgets : undefined;
		return (tabWidgets) ? widgets.concat(<Widget[]>tabWidgets) : widgets;
	});
	return mock;
}


/**
 * Clones all tabs and polyfills functions in widgets that are usually not supplied on widget creation.
 */
function cloneAndPolyfillTabs(window: Window, tabs: WindowTabDesc[] | undefined): WindowTabDesc[] | undefined
{
	if (!tabs)
	{
		return undefined;
	}

	const len = tabs.length, result = Array<WindowTabDesc>(len);
	let i = 0;
	for (; i < len; i++)
	{
		const copy = clone(tabs[i]);
		copy.widgets = <WidgetDesc[]>cloneAndPolyfillWidgets(window, copy.widgets);
		result[i] = copy;
	}
	return result;
}


/**
 * Polyfills functions in widgets that are usually not supplied on widget creation.
 */
function cloneAndPolyfillWidgets(window: Window, widgets: Widget[] | WidgetDesc[] | undefined): Widget[]
{
	if (!widgets)
	{
		return [];
	}

	const len = widgets.length, result = Array<Widget>(len);
	let i = 0;
	for (; i < len; i++)
	{
		const widget = <Mutable<Widget>>clone(widgets[i]);
		widget.window = window;
		if (widget.type === "viewport")
		{
			polyfillViewport(widget);
		}
		result[i] = widget;
	}
	return result;
}



// A mock of a viewport to take functions from.
const viewportMock = ViewportMocker();


/**
 * Polyfills functions on the viewport.
 */
function polyfillViewport(widget: Mutable<ViewportWidget>): void
{
	if (!widget.viewport)
	{
		widget.viewport = {} as Viewport;
	}
	const viewport = widget.viewport;
	if (!viewport.getCentrePosition)
	{
		viewport.getCentrePosition = viewportMock.getCentrePosition;
	}
	if (!viewport.moveTo)
	{
		viewport.moveTo = viewportMock.moveTo;
	}
	if (!viewport.scrollTo)
	{
		viewport.scrollTo = viewportMock.scrollTo;
	}
}