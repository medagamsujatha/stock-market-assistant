import { storage } from "./storage";
  async function seed() {
    try {
      const positions = await storage.getPositions();
      if (positions.length === 0) {
        await storage.createPosition({ symbol: "RELIANCE", quantity: 50, averagePrice: 2850.5, type: "equity" });
        await storage.createPosition({ symbol: "HDFCBANK", quantity: 100, averagePrice: 1450.2, type: "equity" });
        await storage.createPosition({ symbol: "NIFTY24DEC22000CE", quantity: 150, averagePrice: 120.5, type: "option" });
        console.log("Database seeded with mock positions");
      } else {
        console.log("Positions already exist");
      }
    } catch(e) {
      console.error(e);
    }
  }
  seed();