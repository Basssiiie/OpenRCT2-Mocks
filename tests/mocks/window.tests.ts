/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import { WindowMocker } from "../../src/mocks/ui/window";


test("All auto-mocked members are overridable", t =>
{
	const hits: unknown[] = [];
	const mock = WindowMocker({
		classification: "a window",
		number: 5,
		x: 25,
		y: 18,
		width: 102,
		height: 104,
		minWidth: 98,
		minHeight: 23,
		maxWidth: 304,
		maxHeight: 249,
		isSticky: true,
		title: "this is title",
		colours: [ 4, 7, 11 ],
		widgets: [{ type: "label", x: 4, y: 6, width: 45, height: 19 }],
		tabs: [
			{ image: 44, widgets: [{ type: "groupbox", x: 19, y: 15, width: 121, height: 78 }] },
			{ image: 59, widgets: [{ type: "colourpicker", x: 65, y: 1, width: 52, height: 41 }] }
		],
		tabIndex: 1,
        onClose() { hits.push("onClose"); },
        onUpdate() { hits.push("onUpdate"); },
        onTabChange() { hits.push("onTabChange"); },
        close() { hits.push("close"); },
        bringToFront() { hits.push("bringToFront"); },
        findWidget<T extends Widget>(name: string) { hits.push(`findWidget: ${name}`); return <T>{}; }
	});

	t.is(mock.classificationName, "a window");
	t.is(mock.classification, 225);
	t.true(mock.number >= 0);
	t.is(mock.x, 25);
	t.is(mock.y, 18);
	t.is(mock.width, 102);
	t.is(mock.height, 104);
	t.is(mock.minWidth, 98);
	t.is(mock.minHeight, 23);
	t.is(mock.maxWidth, 304);
	t.is(mock.maxHeight, 249);
	t.is(mock.isSticky, true);
	t.is(mock.title, "this is title");
	t.deepEqual(mock.colours, [ 4, 7, 11 ]);
	t.deepEqual(mock.widgets, [
		{ type: "label", x: 4, y: 6, width: 45, height: 19 },
		{ type: "colourpicker", x: 65, y: 1, width: 52, height: 41 }
	]);
	t.is(mock.tabIndex, 1);

	mock.onClose?.();
	mock.onUpdate?.();
	mock.onTabChange?.();
	mock.close?.();
	mock.bringToFront?.();
	mock.findWidget?.("bobby");

	t.deepEqual(hits, [ "onClose", "onUpdate", "onTabChange", "close", "bringToFront", "findWidget: bobby" ]);
});