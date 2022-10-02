/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import { TrackIteratorMocker } from "../../src/mocks/tracks/trackIterator";
import { TrackSegmentMocker } from "../../src/mocks/tracks/trackSegment";


test("All auto-mocked members are overridable", t =>
{
	const mock = TrackIteratorMocker({
		position: { x: 1, y: 2, z: 3, direction: 1 },
		previousPosition: { x: 9, y: 8, z: 7, direction: 3 },
		nextPosition: { x: 4, y: 6, z: 5, direction: 2 },
		segment: TrackSegmentMocker(),
		trackPieceIndex: 55,
		trackPieces: [],
		segments: [],
		next: () => true,
		previous: () => false
	});

	t.deepEqual(mock.position, { x: 1, y: 2, z: 3, direction: 1 });
	t.deepEqual(mock.previousPosition, { x: 9, y: 8, z: 7, direction: 3 });
	t.deepEqual(mock.nextPosition, { x: 4, y: 6, z: 5, direction: 2 });
	t.truthy(mock.segment);
	t.is(typeof mock.segment, "object");
	t.is(mock.trackPieceIndex, 55);
	t.deepEqual(mock.trackPieces, []);
	t.deepEqual(mock.segments, []);
	t.is(mock.next(), true);
	t.is(mock.previous(), false);
});


test("Position is from track", t =>
{
	const mock = TrackIteratorMocker({
		trackPieces: [
			{ location: { x: 5, y: 8, z: 2, direction: 0 } }
		]
	});

	t.deepEqual(mock.position, { x: 5, y: 8, z: 2, direction: 0 });
});


test("Next position is from track", t =>
{
	const mock = TrackIteratorMocker({
		trackPieces: [
			{ location: { x: 5, y: 8, z: 2, direction: 0 } },
			{ location: { x: 9, y: 6, z: 5, direction: 1 } },
		]
	});

	t.deepEqual(mock.nextPosition, { x: 9, y: 6, z: 5, direction: 1 });
});


test("Previous position is from track", t =>
{
	const mock = TrackIteratorMocker({
		trackPieces: [
			{ location: { x: 8, y: 5, z: 6, direction: 3 } },
			{ location: { x: 5, y: 7, z: 2, direction: 2 } },
		],
		trackPieceIndex: 1
	});

	t.deepEqual(mock.previousPosition, { x: 8, y: 5, z: 6, direction: 3 });
});


test("next() gets position from next track piece", t =>
{
	const mock = TrackIteratorMocker({
		trackPieces: [
			{ location: { x: 5, y: 8, z: 2, direction: 0 } },
			{ location: { x: 9, y: 6, z: 5, direction: 1 } },
		]
	});

	t.true(mock.next());
	t.deepEqual(mock.position, { x: 9, y: 6, z: 5, direction: 1 });
});


test("next() returns false at end of track", t =>
{
	const mock = TrackIteratorMocker({
		trackPieces: [
			{ location: { x: 5, y: 8, z: 2, direction: 0 } },
			{ location: { x: 9, y: 6, z: 5, direction: 1 } },
		],
		trackPieceIndex: 1
	});

	t.deepEqual(mock.position, { x: 9, y: 6, z: 5, direction: 1 });
	t.false(mock.next());
	t.deepEqual(mock.position, { x: 9, y: 6, z: 5, direction: 1 });
});


test("previous() gets position from previous track piece", t =>
{
	const mock = TrackIteratorMocker({
		trackPieces: [
			{ location: { x: 8, y: 5, z: 6, direction: 3 } },
			{ location: { x: 5, y: 7, z: 2, direction: 2 } },
		],
		trackPieceIndex: 1
	});

	t.true(mock.previous());
	t.deepEqual(mock.position, { x: 8, y: 5, z: 6, direction: 3 });
});


test("previous() returns false at end of track", t =>
{
	const mock = TrackIteratorMocker({
		trackPieces: [
			{ location: { x: 8, y: 5, z: 6, direction: 3 } },
			{ location: { x: 5, y: 7, z: 2, direction: 2 } },
		]
	});

	t.deepEqual(mock.position, { x: 8, y: 5, z: 6, direction: 3 });
	t.false(mock.previous());
	t.deepEqual(mock.position, { x: 8, y: 5, z: 6, direction: 3 });
});


test("next() and previous() always returns true without specified track pieces", t =>
{
	const mock = TrackIteratorMocker();

	t.true(mock.next());
	t.true(mock.previous());
	t.true(mock.previous());
	t.true(mock.previous());
	t.true(mock.next());
	t.true(mock.next());
	t.true(mock.next());
	t.true(mock.previous());
});


test("Segment is from track", t =>
{
	const mock = TrackIteratorMocker({
		trackPieces: [
			{ trackType: 4, location: { x: 8, y: 5, z: 6, direction: 3 } },
		],
		segments: [
			TrackSegmentMocker({ type: 2, beginZ: 45 }),
			TrackSegmentMocker({ type: 4, beginZ: 25 }),
			TrackSegmentMocker({ type: 7, beginZ: 77 }),
		]
	});

	t.is(mock.segment?.type, 4);
	t.is(mock.segment?.beginZ, 25);
});