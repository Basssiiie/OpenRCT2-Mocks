
/**
 * Returns `true` if the flag is present, or `false` if not.
 */
function hasFlag<T>(flags: T[] | undefined, flag: T): boolean
{
	return (flags !== undefined && hasFlagStrict(flags, flag));
}


/**
 * Sets the flag to the specified value.
 */
function setFlag<T>(flags: T[], flag: T, value: boolean): T[];
function setFlag<T>(flags: T[] | undefined, flag: T, value: boolean): T[] | undefined;
function setFlag<T>(flags: T[] | undefined, flag: T, value: boolean): T[] | undefined
{
	if (value)
	{
		if (!flags)
		{
			flags = [ flag ];
		}
		else if (!hasFlagStrict(flags, flag))
		{
			flags.push(flag);
		}
	}
	else if (flags)
	{
		const idx = flags.indexOf(flag);
		if (idx !== -1)
		{
			flags.splice(idx, 1);
		}
	}
	return flags;
}


/**
 * Quick helper without the check for `undefined`.
 */
function hasFlagStrict<T>(flags: T[], flag: T): boolean
{
	return (flags.indexOf(flag) !== -1);
}


export { hasFlag as has, setFlag as set };