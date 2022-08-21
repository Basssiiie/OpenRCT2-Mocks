/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import { WindowMock } from "../../src";
import { UiMocker } from "../../src/mocks/ui/ui";


test("All auto-mocked members are overridable", t =>
{
	const hits: unknown[] = [];
	const mock = UiMocker({
		mainViewport: { left: 55 } as Viewport,
		openWindow(desc: WindowDesc) { hits.push(desc.classification); return {} as Window; },
		closeWindows(classification: string, id?: number) { hits.push([classification, id]); },
		getWindow(id: string | number) { hits.push(id); return {} as Window; },
	});

	t.is(mock.mainViewport.left, 55);

	mock.openWindow({ classification: "open" } as WindowDesc);
	mock.closeWindows("close", 55);
	mock.getWindow("get");

	t.deepEqual(hits, ["open", ["close", 55], "get"]);
});


test("Main viewport is valid viewport", t =>
{
	const mock = UiMocker();

	const viewport = mock.mainViewport;
	t.truthy(viewport);

	viewport.moveTo({ x: 2000, y: 3000 });
	t.truthy(viewport.left);
	t.truthy(viewport.right);
	t.truthy(viewport.bottom);
	t.truthy(viewport.top);
});


test("Open window gets added to created", t =>
{
	const mock = UiMocker();

	const window = mock.openWindow({
		classification: "test",
		width: 50, height: 80,
		title: "hello world"
	});

	t.is(window.width, 50);
	t.is(window.height, 80);
	t.is(window.title, "hello world");

	const windowMock = window as WindowMock;
	t.true(mock.createdWindows.includes(windowMock));
	t.true(windowMock.isOpen);
});


test("Open window with viewport gets polyfilled", t =>
{
	const mock = UiMocker();

	const window = mock.openWindow({
		classification: "test 1", title: "test 2",
		width: 50, height: 80,
		widgets: [
			<ViewportWidget>{
				width: 20, height: 20,
				type: "viewport",
			}
		]
	});

	const widget = window.widgets[0] as ViewportWidget;
	t.truthy(widget);
	t.is(widget.type, "viewport");

	const viewport = widget.viewport;
	viewport?.moveTo({ x: 700, y: 900 });
	t.truthy(viewport?.left);
	t.truthy(viewport?.right);
	t.truthy(viewport?.top);
	t.truthy(viewport?.bottom);

	const center = viewport?.getCentrePosition();
	t.is(center?.x, 700);
	t.is(center?.y, 900);
});


test("Close all windows calls closed", t =>
{
	const hits: string[] = [];
	const mock = UiMocker();

	const window1 = mock.openWindow({
		classification: "test 1", title: "title 1",
		width: 250, height: 200,
		onClose: () => hits.push("hit 1")
	});
	const window2 = mock.openWindow({
		classification: "test 2", title: "title 2",
		width: 250, height: 200,
		onClose: () => hits.push("hit 2")
	});

	mock.closeAllWindows();

	t.false((window1 as WindowMock).isOpen);
	t.false((window2 as WindowMock).isOpen);
	t.is(hits.filter(h => h === "hit 1").length, 1);
	t.is(hits.filter(h => h === "hit 2").length, 1);
});


test("Close window calls closed", t =>
{
	t.plan(2);
	const mock = UiMocker();

	const window = mock.openWindow({
		classification: "test 1", title: "test 2",
		width: 250, height: 200,
		onClose: () => t.pass()
	});

	mock.closeWindows("test 1");

	const windowMock = window as WindowMock;
	t.false(windowMock.isOpen);
});


test("Get window gets window", t =>
{
	const mock = UiMocker();

	const window = mock.openWindow({
		classification: "test get", title: "get title",
		width: 250, height: 200,
	});

	const get = mock.getWindow("test get");

	t.is(window, get);
});


test("Get unknown window returns null", t =>
{
	const mock = UiMocker();

	const unknown = mock.getWindow("get unknown");

	t.falsy(unknown);
});

const testDesc: WindowDesc =
{
	classification: "test",
	width: 1,
	height: 1,
	title: "Test Desc",
	widgets: [
		<TextBoxWidget>{
			type: "textbox",
			x: 10,
			y: 10,
			width: 180,
			height: 10,
			text: "Textbox in widgets",
		},
	],
	tabs: [
		{
			image: 0,
			widgets: [
				<LabelWidget>{
					type: "label",
					x: 20,
					y: 20,
					width: 180,
					height: 10,
					text: "Label in tab[0]",
				},
			]
		},
		{
			image: 1,
			widgets: [
				<SpinnerWidget>{
					type: "spinner",
					x: 30,
					y: 30,
					width: 180,
					height: 10,
					text: "Spinner in tab[1]",
				},
			]
		}
	]
};

test("Get window returns widgets from windowDesc.tabs", t =>
{
	// create a copy of testDesc
	const tempDesc = JSON.parse(JSON.stringify(testDesc));
	const mock = UiMocker();
	const window = mock.openWindow(tempDesc);
	const widgets = window.widgets;
	// for this test, make sure that widgets[] from the windowDesc are in
	t.deepEqual(widgets[0], {
		type: "textbox",
		x: 10,
		y: 10,
		width: 180,
		height: 10,
		text: "Textbox in widgets",
	});
});

// for this test, make sure the widgets[] from tab[0] are in when no tabIndex is given
test("Widgets[] includes 0th tab if no tabIndex given", t =>
{
	// create a copy of testDesc
	const tempDesc = JSON.parse(JSON.stringify(testDesc));
	const mock = UiMocker();
	const window = mock.openWindow(tempDesc);
	const widgets = window.widgets;

	t.deepEqual(widgets[0], {
		type: "textbox",
		x: 10,
		y: 10,
		width: 180,
		height: 10,
		text: "Textbox in widgets",
	});
	t.deepEqual(widgets[1], {
		type: "label",
		x: 20,
		y: 20,
		width: 180,
		height: 10,
		text: "Label in tab[0]",
	});
	t.deepEqual(widgets[2], undefined);
});

// for this test, make sure the widgets from tab[1] are in when tabIndex is set to 1
test("Widgets[] includes proper widgets by tabIndex", t =>
{
	// create a copy of testDesc
	const tempDesc = JSON.parse(JSON.stringify(testDesc));
	const mock = UiMocker();
	tempDesc.tabIndex = 1;
	const window = mock.openWindow(tempDesc);
	const widgets = window.widgets;

	t.deepEqual(widgets[0], {
		type: "textbox",
		x: 10,
		y: 10,
		width: 180,
		height: 10,
		text: "Textbox in widgets",
	});
	t.deepEqual(widgets[1], {
		type: "spinner",
		x: 30,
		y: 30,
		width: 180,
		height: 10,
		text: "Spinner in tab[1]",
	});
	t.deepEqual(widgets[2], undefined);
});

test("Window with no widgets[] populates with widgets from tab", t =>
{
	const wd: WindowDesc = {
		classification: "test",
		width: 10,
		height: 10,
		title: "Test",
		tabs: [
			{
				image: 0,
				widgets: [
					<LabelWidget>{
						type: "label",
						x: 20,
						y: 20,
						width: 180,
						height: 10,
						text: "Label in tab[0]",
					},
				]
			},
			{
				image: 1,
				widgets: [
					<SpinnerWidget>{
						type: "spinner",
						x: 30,
						y: 30,
						width: 180,
						height: 10,
						text: "Spinner in tab[1]",
					},
				]
			}
		]
	};

	const mock = UiMocker();
	const window = mock.openWindow(wd);
	const widgets = window.widgets;

	t.deepEqual(widgets[0], {
		type: "label",
		x: 20,
		y: 20,
		width: 180,
		height: 10,
		text: "Label in tab[0]",
	});

	t.deepEqual(widgets[1], undefined);
});
