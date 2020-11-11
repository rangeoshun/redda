const { div, br, hr, h1, input, button, label, span, i, ul, li } = redda.dom
const { rnd_id, reduc } = redda.utils
const state = redda.state()

const positions = () => []
const add_position = (positions, new_position) => [...positions, new_position]
const update_positions = (_, positions) => positions

state.add(positions, add_position, update_positions)

const box = ({ x, y, r }) => [
  div,
  {
    class: 'box',
    style: {
      transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`,
      width: `${r}px`,
      height: `${r}px`
    }
  }
]

const boxes = state.conn(
  ({ positions }) => [
    div,
    { class: 'boxes' },
    [span, { class: 'counter' }, positions.length.toString()],
    ...((positions && positions.map((pos) => [box, pos])) || [])
  ],
  positions
)

const app_cont = document.getElementById('app-cont')
const render_app = redda.render(app_cont, [boxes])

state.on_change(() => render_app())

const control = { stop: false, count: 0, max: 25 }
document.body.addEventListener('click', () => (control.stop = !control.stop))

const update_state = () => (
  (control.count = state.get().positions.length),
  (!control.stop &&
    state.disp(add_position, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 60 + 30
    })) ||
    (control.count < control.max &&
      state.disp(add_position, {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight,
        r: Math.random() * 60 + 30
      })),
  (control.stop = control.stop || control.max < state.get().positions.length),
  state.disp(
    update_positions,
    state.get().positions.reduce(
      (acc, { x, y, r }, rand, pos, remove) => (
        (remove = y < -r),
        (!remove &&
          ((rand = Math.random() * 2 - 1),
          (pos = {
            x: x + rand,
            y: rand < 0 ? y + rand : y - rand,
            r
          }),
          [...acc, pos])) ||
          acc
      ),
      []
    )
  ),
  requestAnimationFrame(update_state)
)

requestAnimationFrame(update_state)
