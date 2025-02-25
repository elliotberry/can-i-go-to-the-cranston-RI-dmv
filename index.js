import { exec } from "node:child_process"
import { promisify } from "node:util"

const execAsync = promisify(exec)

async function playBell() {
  let bellSound = "./bell.mp3"
  try {
    // For macOS
    if (process.platform === "darwin") {
      await execAsync(`afplay ${bellSound}`)
    }
    // For Linux
    else if (process.platform === "linux") {
      await execAsync(`mpg123 ${bellSound}`)
    }
    // For Windows
    else if (process.platform === "win32") {
      await execAsync(
        `powershell -c (New-Object Media.SoundPlayer "${bellSound}").PlaySync();`
      )
    } else {
      console.error("Unsupported platform.")
    }
  } catch (error) {
    console.error("Error playing bell sound:", error.message)
  }
}

const main = async () => {
  try {
    let response = await fetch(
      "https://ridmvreservations.ri.gov/WebAPI/reservation/slots?visitTypeId=20"
    )
    let data = await response.json()
    let str = JSON.stringify(data)
    if (str.includes("cranston")) {
      await playBell()
    } else {
      console.log("No cranston found.")
    }
  } catch (error) {
    console.error("Error in main function:", error.message)
  }
}

// Run main function every 2 minutes (120,000 ms)
setInterval(main, 120000)

// Run it immediately on startup as well
main()