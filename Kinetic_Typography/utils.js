export function distance(x1, y1, x2, y2) {
  const x = x2 - x1;
  const y = y2 - y1;
  return Math.sqrt(x * x + y * y);
}

export function pointCircle(px, py, cx, cy, r) {
  if (distance(px, py, cx, cy) <= r) return true;
  return false;
}

//마우스 위치, 선의 끝 점들의 거리를 통해 당겨지는 한계를 계산해주는 함수
export function linePoint(x1, y1, x2, y2, px, py) {
  const dist1 = distance(px, py, x1, y1);
  const dist2 = distance(px, py, x2, y2);
  const dist = dist1 + dist2;
  const lineLength = distance(x1, y1, x2, y2);
  const buffer = 0.1;

  if (dist >= lineLength - buffer && dist <= lineLength + buffer) {
    return true;
  } else {
    return false;
  }
}

//선에서 마우스가 닿았는지 확인해주는 함수
export function lineCircle(x1, y1, x2, y2, cx, cy, r) {
  const lineLength = distance(x1, y1, x2, y2);

  const point =
    (cx - x1) * (x2 - x1) + ((cy - y1) * (y2 - y1)) / Math.pow(lineLength, 2);

  const px = x1 + point * (x2 - x1);
  const py = y1 + point * (y2 - y1);
  const onSegment = linePoint(x1, y1, x2, y2, px, py); // 과하게 당겨졌을 경우
  if (!onSegment) return false;

  if (distance(px, py, cx, cy) < r) {
    return true;
  } else {
    return false;
  }
}
