import { Mocker } from "../core/mocker";


/**
 * A mock of the ui viewport.
 * @internal
 */
export function ViewportMocker(template?: Partial<Viewport>): Viewport
{
	return Mocker<Viewport>({
		top: 0,
		bottom: 100,
		left: 0,
		right: 100,
		zoom: 0,
		rotation: 0,
		visibilityFlags: 0,
		getCentrePosition()
		{
			const vw = this as Viewport;
			return {
				x: (vw.left + vw.right) / 2,
				y: (vw.top + vw.bottom) / 2
			};
		},
		moveTo(position: CoordsXY | CoordsXYZ): void
		{
			this.left = (position.x - 50);
			this.right = (position.x + 50);
			this.bottom = (position.y - 50);
			this.top = (position.y + 50);
		},
		scrollTo(position: CoordsXY | CoordsXYZ): void
		{
			if (this.moveTo)
			{
				this.moveTo(position);
			}
		},

		...template,
	});
}