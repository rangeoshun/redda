const { div, br, hr, h1, input, button, label, span, i, ul, li } = redda.dom
const { rnd_id, reduc } = redda.utils
const state = redda.state()

const positions = () => []
const add_position = (positions, new_position) => [...positions, new_position]
const update_positions = (_, positions) => positions

state.add(positions, add_position, update_positions)

const box = ({ x, y }, ...content) => [
  div,
  {
    class: 'box',
    style: { transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)` }
  }
]

const boxes = state.conn(
  ({ positions }) => [
    div,
    { class: 'boxes' },
    [span, { class: 'counter' }, positions.length.toString()],
    ...((positions && positions.map(pos => [box, pos])) || [])
  ],
  positions
)

const app_cont = document.getElementById('app-cont')
const render_app = redda.render(app_cont, [boxes])

state.on_change(() => render_app())

const control = { stop: false, fps: 0 }
document.body.addEventListener('click', () => (control.stop = !control.stop))

const update_state = () => (
  !control.stop &&
    state.disp(add_position, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }),
  state.disp(
    update_positions,
    state.get().positions.map(({ x, y }) => ({
      x: x + (Math.random() * 2 - 1),
      y: y + (Math.random() * 2 - 1)
    }))
  ),
  (control.fps = control.fps + 1),
  requestAnimationFrame(update_state)
)

requestAnimationFrame(update_state)

setInterval(
  () => (
    !control.stop && console.log(control.fps * 10),
    control.fps * 10 < 50 && (control.stop = true),
    (control.fps = 0)
  ),
  100
)
