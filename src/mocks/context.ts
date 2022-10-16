import { Mocker } from "../core/mocker";
import * as ArrayHelper from "../utilities/array";
import { Writeable } from "../utilities/writable";
import { TrackSegmentMocker } from "./tracks/trackSegment";


/**
 * Keeps track of a subscription to an OpenRCT2 hook.
 */
export interface Subscription
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
 * Keeps track of a OpenRCT2 custom registered action.
 */
export interface RegisteredAction
{
	/**
	 * The name of this registered action
	 */
	action: ActionType | string;

	/**
	 * The method that will be called to validate the action.
	 */
	query: (args: object) => GameActionResult;

	/**
	 * The method that will be called to execute the action.
	 */
	execute: (args: object) => GameActionResult;
}


/**
 * Mock that adds additional configurations to the context.
 */
export interface ContextMock extends Writeable<Context>
{
	/**
	 * Keeps track of loaded objects within this context.
	 */
	objects: LoadedObject[];

	/**
	 * Keeps track of registered custom actions.
	 */
	registeredActions: RegisteredAction[];

	/**
	 * Keeps track of registered subscriptions to OpenRCT2 hooks.
	 */
	subscriptions: Subscription[];

	/**
	 * Implement this callback to translate a game action into an action type id
	 * for use in {@link GameActionEventArgs}.
	 */
	getTypeIdForAction: (action: ActionType | string) => number;
}


/**
 * A mock of a context.
 * @internal
 */
export function ContextMocker(template?: Partial<ContextMock>): ContextMock
{
	return Mocker<ContextMock>({
		apiVersion: 0,
		mode: "normal",
		subscriptions: [],
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getObject(type: ObjectType, index: number): any
		{
			return ArrayHelper.tryFind(this.objects, o => o.index === index && o.type === type)
				|| <LoadedObject><unknown>null;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getAllObjects(type: ObjectType): any[]
		{
			return (this.objects)
				? this.objects.filter(o => o.type === type)
				: [];
		},
		getTrackSegment(type: number): TrackSegment | null
		{
			return TrackSegmentMocker({ type });
		},
		// eslint-disable-next-line @typescript-eslint/ban-types
		subscribe(hook: string, callback: Function): IDisposable
		{
			const subscription: Subscription =
			{
				hook,
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
		registerAction(action: string, query: (args: object) => GameActionResult, execute: (args: object) => GameActionResult): void
		{
			if (ArrayHelper.tryFind(this.registeredActions, r => r.action === action))
			{
				throw Error("Action has already been registered.");
			}
			const registration = { action, query, execute };
			if (this.registeredActions)
			{
				this.registeredActions.push(registration);
			}
			else
			{
				this.registeredActions = [ registration ];
			}
		},
		queryAction(action: ActionType, args: object, callback?: (result: GameActionResult) => void): void
		{
			const result = queryOrExecuteAction(this, "action.query", action, args, (r, a) => r.query(a));
			callback?.(result);
		},
		executeAction(action: ActionType, args: Record<string, unknown>, callback?: (result: GameActionResult) => void): void
		{
			const result = queryOrExecuteAction(this, "action.execute", action, args, (r, a) => r.execute(a));
			callback?.(result);
		},
		getRandom(min: number): number
		{
			return min;
		},

		...template,
	});
}


function queryOrExecuteAction(context: Partial<ContextMock>, hook: "action.query" | "action.execute", action: ActionType, args: object, queryOrExecute: (action: RegisteredAction, args: object) => GameActionResult): GameActionResult
{
	const registration = ArrayHelper.tryFind(context.registeredActions, r => r.action === action);
	const result = (registration) ? queryOrExecute(registration, args) : { cost: 1 };

	if (context.subscriptions)
	{
		const eventArgs: Writeable<Partial<GameActionEventArgs>> = { action, args, result };
		if (context.getTypeIdForAction)
		{
			eventArgs.type = context.getTypeIdForAction(action);
		}
		context.subscriptions
			.filter(s => s.hook === hook && !s.isDisposed)
			.forEach(s => s.callback(eventArgs));
	}
	return result;
}