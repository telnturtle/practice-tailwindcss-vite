import './App.css'
import { Google } from './components/Google'

function App() {
  return (
    <div className="mx-auto min-w-[320px] max-w-[500px]">
      <div>
        <h2 className="mb-3 text-xl font-semibold">Google Play</h2>
        <Google />
      </div>
    </div>
  )
}

export default App
