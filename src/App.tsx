import './App.css'
import { Google } from './components/Google'

function App() {
  return (
    <div className="mx-auto min-w-[270px] max-w-[360px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[660px] xl:max-w-[900px]">
      <div>
        <h2 className="mb-3 text-xl font-semibold">Google Play</h2>
        <Google />
      </div>
    </div>
  )
}

export default App
