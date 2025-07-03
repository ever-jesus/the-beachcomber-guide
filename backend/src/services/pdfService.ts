import pdf from 'pdf-parse';

export interface ParsedPDFData {
  skills: string[];
  experience: string[];
  aspirations: string[];
  strengths: string[];
  areasForGrowth: string[];
  rawText: string;
}

export type ProfileType = 'jigsaw' | 'pathways' | 'workday';

export class PDFService {
  /**
   * Extract text from PDF buffer
   */
  static async extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
    try {
      const data = await pdf(pdfBuffer);
      return data.text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  /**
   * Parse Jigsaw PDF content
   */
  static parseJigsawPDF(text: string): ParsedPDFData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const skills: string[] = [];
    const experience: string[] = [];
    const aspirations: string[] = [];
    const strengths: string[] = [];
    const areasForGrowth: string[] = [];

    let currentSection = '';
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Identify sections
      if (lowerLine.includes('skills') || lowerLine.includes('competencies')) {
        currentSection = 'skills';
        continue;
      } else if (lowerLine.includes('experience') || lowerLine.includes('background')) {
        currentSection = 'experience';
        continue;
      } else if (lowerLine.includes('aspirations') || lowerLine.includes('goals') || lowerLine.includes('next')) {
        currentSection = 'aspirations';
        continue;
      } else if (lowerLine.includes('strengths') || lowerLine.includes('strength')) {
        currentSection = 'strengths';
        continue;
      } else if (lowerLine.includes('growth') || lowerLine.includes('development') || lowerLine.includes('improve')) {
        currentSection = 'growth';
        continue;
      }

      // Extract content based on current section
      if (currentSection === 'skills' && line.length > 3 && !line.includes(':')) {
        skills.push(line);
      } else if (currentSection === 'experience' && line.length > 3 && !line.includes(':')) {
        experience.push(line);
      } else if (currentSection === 'aspirations' && line.length > 3 && !line.includes(':')) {
        aspirations.push(line);
      } else if (currentSection === 'strengths' && line.length > 3 && !line.includes(':')) {
        strengths.push(line);
      } else if (currentSection === 'growth' && line.length > 3 && !line.includes(':')) {
        areasForGrowth.push(line);
      }
    }

    return {
      skills,
      experience,
      aspirations,
      strengths,
      areasForGrowth,
      rawText: text
    };
  }

  /**
   * Parse Pathways PDF content
   */
  static parsePathwaysPDF(text: string): ParsedPDFData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const skills: string[] = [];
    const experience: string[] = [];
    const aspirations: string[] = [];
    const strengths: string[] = [];
    const areasForGrowth: string[] = [];

    let currentSection = '';
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Identify sections
      if (lowerLine.includes('skills') || lowerLine.includes('capabilities')) {
        currentSection = 'skills';
        continue;
      } else if (lowerLine.includes('experience') || lowerLine.includes('work history')) {
        currentSection = 'experience';
        continue;
      } else if (lowerLine.includes('aspirations') || lowerLine.includes('career goals')) {
        currentSection = 'aspirations';
        continue;
      } else if (lowerLine.includes('strengths') || lowerLine.includes('key strengths')) {
        currentSection = 'strengths';
        continue;
      } else if (lowerLine.includes('development') || lowerLine.includes('growth areas')) {
        currentSection = 'growth';
        continue;
      }

      // Extract content based on current section
      if (currentSection === 'skills' && line.length > 3 && !line.includes(':')) {
        skills.push(line);
      } else if (currentSection === 'experience' && line.length > 3 && !line.includes(':')) {
        experience.push(line);
      } else if (currentSection === 'aspirations' && line.length > 3 && !line.includes(':')) {
        aspirations.push(line);
      } else if (currentSection === 'strengths' && line.length > 3 && !line.includes(':')) {
        strengths.push(line);
      } else if (currentSection === 'growth' && line.length > 3 && !line.includes(':')) {
        areasForGrowth.push(line);
      }
    }

    return {
      skills,
      experience,
      aspirations,
      strengths,
      areasForGrowth,
      rawText: text
    };
  }

  /**
   * Parse Workday PDF content
   */
  static parseWorkdayPDF(text: string): ParsedPDFData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const skills: string[] = [];
    const experience: string[] = [];
    const aspirations: string[] = [];
    const strengths: string[] = [];
    const areasForGrowth: string[] = [];

    let currentSection = '';
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Identify sections
      if (lowerLine.includes('skills') || lowerLine.includes('competencies') || lowerLine.includes('capabilities')) {
        currentSection = 'skills';
        continue;
      } else if (lowerLine.includes('experience') || lowerLine.includes('work history') || lowerLine.includes('employment')) {
        currentSection = 'experience';
        continue;
      } else if (lowerLine.includes('aspirations') || lowerLine.includes('career goals') || lowerLine.includes('objectives')) {
        currentSection = 'aspirations';
        continue;
      } else if (lowerLine.includes('strengths') || lowerLine.includes('key strengths') || lowerLine.includes('achievements')) {
        currentSection = 'strengths';
        continue;
      } else if (lowerLine.includes('development') || lowerLine.includes('growth areas') || lowerLine.includes('improvement')) {
        currentSection = 'growth';
        continue;
      }

      // Extract content based on current section
      if (currentSection === 'skills' && line.length > 3 && !line.includes(':')) {
        skills.push(line);
      } else if (currentSection === 'experience' && line.length > 3 && !line.includes(':')) {
        experience.push(line);
      } else if (currentSection === 'aspirations' && line.length > 3 && !line.includes(':')) {
        aspirations.push(line);
      } else if (currentSection === 'strengths' && line.length > 3 && !line.includes(':')) {
        strengths.push(line);
      } else if (currentSection === 'growth' && line.length > 3 && !line.includes(':')) {
        areasForGrowth.push(line);
      }
    }

    return {
      skills,
      experience,
      aspirations,
      strengths,
      areasForGrowth,
      rawText: text
    };
  }

  /**
   * Parse PDF based on profile type
   */
  static async parsePDFByType(pdfBuffer: Buffer, profileType: ProfileType): Promise<ParsedPDFData> {
    const text = await this.extractTextFromPDF(pdfBuffer);
    
    switch (profileType) {
      case 'jigsaw':
        return this.parseJigsawPDF(text);
      case 'pathways':
        return this.parsePathwaysPDF(text);
      case 'workday':
        return this.parseWorkdayPDF(text);
      default:
        return this.parseGenericPDF(text);
    }
  }

  /**
   * Auto-detect PDF type and parse accordingly
   */
  static async parsePDF(pdfBuffer: Buffer): Promise<ParsedPDFData> {
    const text = await this.extractTextFromPDF(pdfBuffer);
    const lowerText = text.toLowerCase();
    
    // Detect PDF type based on content
    if (lowerText.includes('jigsaw') || lowerText.includes('thoughtworks')) {
      return this.parseJigsawPDF(text);
    } else if (lowerText.includes('pathways') || lowerText.includes('career path')) {
      return this.parsePathwaysPDF(text);
    } else if (lowerText.includes('workday') || lowerText.includes('hr system')) {
      return this.parseWorkdayPDF(text);
    } else {
      // Default parsing for unknown PDF types
      return this.parseGenericPDF(text);
    }
  }

  /**
   * Generic PDF parsing for unknown formats
   */
  static parseGenericPDF(text: string): ParsedPDFData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const skills: string[] = [];
    const experience: string[] = [];
    const aspirations: string[] = [];
    const strengths: string[] = [];
    const areasForGrowth: string[] = [];

    // Simple keyword-based extraction
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('skill') || lowerLine.includes('technology') || lowerLine.includes('language')) {
        skills.push(line);
      } else if (lowerLine.includes('experience') || lowerLine.includes('worked') || lowerLine.includes('project')) {
        experience.push(line);
      } else if (lowerLine.includes('goal') || lowerLine.includes('aspiration') || lowerLine.includes('want to')) {
        aspirations.push(line);
      } else if (lowerLine.includes('strength') || lowerLine.includes('good at') || lowerLine.includes('excel')) {
        strengths.push(line);
      } else if (lowerLine.includes('improve') || lowerLine.includes('learn') || lowerLine.includes('develop')) {
        areasForGrowth.push(line);
      }
    }

    return {
      skills,
      experience,
      aspirations,
      strengths,
      areasForGrowth,
      rawText: text
    };
  }
} 