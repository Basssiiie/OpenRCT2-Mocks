import { Mocker } from "../core/mocker";
import * as ArrayHelper from "../utilities/array";


/**
 * Mock that adds additional configurations to the context.
 */
interface Subscription
{
	hook: string;
	callback: (e: unknown) => void;
	disposable: IDisposable;
	isDisposed: boolean;
}


/**
 * Mock that adds additional configurations to the context.
 */
export interface ContextMock extends Context
{
	objects: LoadedObject[];
	subscriptions: Subscription[];
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
			return this.objects?.filter(o => o.type === type) ?? [];
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
			this.subscriptions?.push(subscription);
			return subscription.disposable;
		},
		executeAction(action: ActionType, args: Record<string, unknown>, callback: (result: GameActionResult) => void): void
		{
			const result: GameActionResult = { cost: 1 };
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