const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const sharp = require("sharp");

class WebsiteAnalyzer {
  constructor(genAI) {
    this.genAI = genAI;
  }

  async analyzeWebsite(url) {
    try {
      // Step 1: Capture screenshot
      const screenshot = await this.captureScreenshot(url);

      // Step 2: Scrape HTML content
      const htmlContent = await this.scrapeContent(url);

      // Step 3: Extract colors from screenshot
      const colorPalette = await this.extractColors(screenshot);

      // Step 4: Use Gemini Vision to analyze brand
      let brandAnalysis = {
        businessType: "general",
        brandTone: "professional",
        targetAudience: "general audience",
        services: [],
        keywords: [],
      };

      if (this.genAI) {
        try {
          brandAnalysis = await this.analyzeBrandWithAI(
            screenshot,
            htmlContent,
          );
        } catch (aiError) {
          console.warn(
            "AI brand analysis failed, using defaults:",
            aiError.message,
          );
        }
      }

      return {
        colorPalette,
        ...brandAnalysis,
        websiteTitle: htmlContent.title,
        description: htmlContent.metaDescription,
      };
    } catch (error) {
      console.error("Website analysis error:", error);
      throw new Error(`Failed to analyze website: ${error.message}`);
    }
  }

  async captureScreenshot(url) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      const screenshot = await page.screenshot({ fullPage: false });
      await browser.close();

      return screenshot;
    } catch (error) {
      if (browser) await browser.close();
      throw error;
    }
  }

  async scrapeContent(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract key elements
      const title = $("title").text();
      const metaDescription =
        $('meta[name="description"]').attr("content") || "";
      const h1Tags = $("h1")
        .map((i, el) => $(el).text())
        .get();
      const paragraphs = $("p")
        .map((i, el) => $(el).text())
        .get()
        .slice(0, 5);

      return {
        title,
        metaDescription,
        headings: h1Tags,
        content: paragraphs.join(" ").substring(0, 500),
      };
    } catch (error) {
      throw new Error(`Failed to scrape content: ${error.message}`);
    }
  }

  async extractColors(screenshot) {
    try {
      const image = sharp(screenshot);
      const { dominant } = await image.stats();

      // Get dominant color
      const dominantColor = `#${this.rgbToHex(dominant.r, dominant.g, dominant.b)}`;

      // Return a basic palette - in production, use a more sophisticated algorithm
      return [dominantColor, "#FFFFFF", "#000000"];
    } catch (error) {
      console.warn("Color extraction failed:", error.message);
      return ["#4A90E2", "#FFFFFF", "#333333"]; // Default palette
    }
  }

  rgbToHex(r, g, b) {
    return [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");
  }

  async analyzeBrandWithAI(screenshot, htmlContent) {
    if (!this.genAI) {
      throw new Error("Gemini AI client not configured");
    }

    const base64Image = screenshot.toString("base64");
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this business website and provide a JSON response with:
1. businessType (e.g., cafe, tech startup, retail store, ngo)
2. brandTone (formal, casual, youthful, professional, or friendly)
3. targetAudience (describe the target demographic)
4. services (array of up to 5 key services/products)
5. keywords (array of 5-7 descriptive brand keywords)

Website content: ${JSON.stringify(htmlContent)}

Respond ONLY with valid JSON, no other text.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/png",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean up response if it contains markdown code blocks
    const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonStr);
  }
}

module.exports = WebsiteAnalyzer;
