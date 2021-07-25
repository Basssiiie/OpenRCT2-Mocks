import { Mocker } from "../core/mocker";
import * as ArrayHelper from "../utilities/array";


/**
 * Mock that adds additional configurations to the game map.
 */
export interface WindowMock extends Window
{
	classificationName: string;
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

		// Give viewports proper functions.
		if (template.widgets)
		{
			for (const widget of (template.widgets as ViewportWidget[]))
			{
				const viewport = widget.viewport;
				if (viewport && !viewport.moveTo)
				{
					viewport.moveTo = (pos: CoordsXY | CoordsXYZ): void =>
					{
						viewport.left = pos.x;
						viewport.top = pos.y;
					};
				}
			}
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

		...template,
		classification: classId,
	});
}