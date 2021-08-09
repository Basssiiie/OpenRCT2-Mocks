import { Mocker } from "../core/mocker";
import * as ArrayHelper from "../utilities/array";


/**
 * Keeps track of a subscription to an OpenRCT2 hook.
 */
interface Subscription
{
	/**
	 * The hook which this subscription subscribes to.
	 */
	hook: ActionType | string;

	/**
	 * The method that should be called when the hook is triggered.
	 */
	callback: (e: unknown) => void;

	/**
	 * The disposable that was returned to the subscriber.
	 */
	disposable: IDisposable;

	/**
	 * True if the subscription has been cancelled, or false if not.
	 */
	isDisposed: boolean;
}


/**
 * Mock that adds additional configurations to the context.
 */
export interface ContextMock extends Context
{
	/**
	 * Keeps track of loaded objects within this context.
	 */
	objects: LoadedObject[];

	/**
	 * Keeps track of registered subscriptions to OpenRCT2 hooks.
	 */
	subscriptions: Subscription[];

	/**
	 * Set a custom result for executed game actions.
	 */
	gameActionResult: GameActionResult;
}


/**
 * A mock of a context.
 * @internal
 */
export function ContextMocker(template?: Partial<ContextMock>): ContextMock
{
	return Mocker<ContextMock>({
		subscriptions: [],
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getObject(type: ObjectType, index: number): any
		{
			const result = ArrayHelper.tryFind(this.objects, o => o.index === index && o.type === type);
			if (!result)
				return <LoadedObject><unknown>null;

			return result;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getAllObjects(type: ObjectType): any[]
		{
			return (this.objects)
				? this.objects.filter(o => o.type === type)
				: [];
		},
		// eslint-disable-next-line @typescript-eslint/ban-types
		subscribe(hook: string, callback: Function): IDisposable
		{
			const subscription: Subscription =
			{
				hook: hook,
				callback: callback as (e: unknown) => void,
				isDisposed: false,
				disposable:
				{
					dispose(): void	{ subscription.isDisposed = true; }
				}
			};
			if (this.subscriptions)
			{
				this.subscriptions.push(subscription);
			}
			else
			{
				this.subscriptions = [ subscription ];
			}
			return subscription.disposable;
		},
		executeAction(action: ActionType, args: Record<string, unknown>, callback: (result: GameActionResult) => void): void
		{
			const result: GameActionResult = (this.gameActionResult)
				? this.gameActionResult : { cost: 1 };

			if (this.subscriptions)
			{
				this.subscriptions
					.filter(s => s.hook === "action.execute" && !s.isDisposed)
					.forEach(s => s.callback(<GameActionEventArgs>{
						action: action,
						args: args,
						result: result
					}));
			}
			callback(result);
		},

		...template,
	});
}