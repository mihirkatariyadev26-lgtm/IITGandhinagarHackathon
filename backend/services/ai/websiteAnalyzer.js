const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const sharp = require("sharp");

class WebsiteAnalyzer {
  constructor(openai) {
    this.openai = openai;
  }

  async analyzeWebsite(url) {
    try {
      // Step 1: Capture screenshot
      const screenshot = await this.captureScreenshot(url);

      // Step 2: Scrape HTML content
      const htmlContent = await this.scrapeContent(url);

      // Step 3: Extract colors from screenshot
      const colorPalette = await this.extractColors(screenshot);

      // Step 4: Use GPT-4 Vision to analyze brand (if OpenAI API key is available)
      let brandAnalysis = {
        businessType: "general",
        brandTone: "professional",
        targetAudience: "general audience",
        services: [],
        keywords: [],
      };

      if (this.openai) {
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
      Browser = await puppeteer.launch({
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
    if (!this.openai) {
      throw new Error("OpenAI client not configured");
    }

    const base64Image = screenshot.toString("base64");

    const response = await this.openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this business website and provide a JSON response with:\n1. businessType (e.g., cafe, tech startup, retail store, ngo)\n2. brandTone (formal, casual, youthful, professional, or friendly)\n3. targetAudience (describe the target demographic)\n4. services (array of up to 5 key services/products)\n5. keywords (array of 5-7 descriptive brand keywords)\n\nWebsite content: ${JSON.stringify(htmlContent)}\n\nRespond ONLY with valid JSON, no other text.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  }
}

module.exports = WebsiteAnalyzer;
