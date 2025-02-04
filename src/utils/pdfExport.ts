import { jsPDF } from 'jspdf';
import { format, addDays, startOfMonth, getWeeksInMonth, isSameDay, isBefore, isAfter } from 'date-fns';
import { DrugType, drugColors as drugColorScheme, DrugEffect } from '../data/drugTypes';
import { DrugSymbol } from '../components/DrugSymbol';

interface CalendarData {
  selectedDrugs: (DrugType & {
    posology: string;
    duration: number;
    sequenceNumber: number;
    customSchedule?: {
      frequency: number;
      interval: number;
      startTime: string;
    };
  })[];
  startDate: Date;
  timeSlots: { hour: number; minute: number; label: string }[];
}

type ColorTuple = [number, number, number];

const drugEffectInfo: Record<DrugEffect, { benefits: string; sideEffects: string }> = {
  artificial_tears: {
    benefits: 'Lubricates and moisturizes the eye',
    sideEffects: 'Minimal; temporary blurred vision'
  },
  nsaids: {
    benefits: 'Reduces pain and inflammation',
    sideEffects: 'Temporary stinging, burning sensation'
  },
  parasympathomimetics: {
    benefits: 'Controls intraocular pressure',
    sideEffects: 'Blurred vision, brow ache'
  },
  sympathomimetics: {
    benefits: 'Reduces redness and congestion',
    sideEffects: 'Temporary burning, increased heart rate'
  },
  parasympatholytics: {
    benefits: 'Dilates pupil for examination',
    sideEffects: 'Light sensitivity, blurred vision'
  },
  sympatholytics: {
    benefits: 'Reduces intraocular pressure',
    sideEffects: 'Fatigue, low blood pressure'
  },
  alpha_agonists: {
    benefits: 'Reduces eye pressure',
    sideEffects: 'Dry mouth, drowsiness'
  },
  beta_blockers: {
    benefits: 'Lowers eye pressure',
    sideEffects: 'Low heart rate, fatigue'
  },
  carbonic_inhibitors: {
    benefits: 'Reduces fluid production',
    sideEffects: 'Tingling, metallic taste'
  },
  prostaglandins: {
    benefits: 'Increases fluid drainage',
    sideEffects: 'Eye color change, lash growth'
  },
  antibiotics: {
    benefits: 'Fights bacterial infections',
    sideEffects: 'Temporary burning, redness'
  },
  mast_cell_stabilizers: {
    benefits: 'Prevents allergic reactions',
    sideEffects: 'Mild stinging, headache'
  },
  corticosteroids: {
    benefits: 'Reduces inflammation and swelling',
    sideEffects: 'May increase eye pressure'
  },
  antihistamines: {
    benefits: 'Relieves allergy symptoms',
    sideEffects: 'Mild burning, dryness'
  },
  long_acting: {
    benefits: 'Extended duration of action',
    sideEffects: 'Varies by medication type'
  }
};

// Helper function to convert hex color to RGB tuple
function hexToRgb(hex: string): ColorTuple {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] as ColorTuple : [0, 0, 0] as ColorTuple;
}

export const generatePDF = async (data: CalendarData, filename: string = 'calendar.pdf') => {
  const { selectedDrugs, startDate, timeSlots } = data;

  // Initialize PDF with better quality settings
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
    precision: 4
  });

  // Enable better text rendering
  pdf.setFont('helvetica');
  pdf.setLanguage('en-US');

  // Page dimensions with proper margins
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20; // Increased margin
  const maxContentWidth = pageWidth - (margin * 2);
  const maxContentHeight = pageHeight - (margin * 2);

  // Dynamic layout calculations
  const maxCellWidth = 45; // Increased cell width for more icon space
  const minCellWidth = 30; // Minimum cell width increased for more icon space
  const timeColumnWidth = 20;
  
  // Calculate cell width based on available space
  const calculatedCellWidth = (maxContentWidth - timeColumnWidth) / 7;
  const cellWidth = Math.min(Math.max(calculatedCellWidth, minCellWidth), maxCellWidth);
  
  // Adjust cell height based on time slots and available space
  const maxCellHeight = 22; // Increased cell height for more icons
  const minCellHeight = 14; // Minimum cell height increased for icon spacing
  const availableHeight = (maxContentHeight - 24) / 2; // Split for two weeks, adjusted header spacing
  const calculatedCellHeight = availableHeight / timeSlots.length;
  const cellHeight = Math.min(Math.max(calculatedCellHeight, minCellHeight), maxCellHeight);

  const headerHeight = 15;
  const weekSpacing = 20;

  // Modern color palette
  const colors = {
    primary: [63, 131, 248] as ColorTuple, // Modern blue
    secondary: [249, 250, 251] as ColorTuple, // Light gray
    accent: [240, 245, 255] as ColorTuple, // Soft blue
    text: {
      dark: [31, 41, 55] as ColorTuple, // Deep gray
      light: [107, 114, 128] as ColorTuple, // Medium gray
      white: [255, 255, 255] as ColorTuple
    },
    border: [229, 231, 235] as ColorTuple,
    shadow: [0, 0, 0, 0.05] as [number, number, number, number]
  };

  // Helper function for shadow effects
  const drawShadow = (x: number, y: number, width: number, height: number, radius: number = 2) => {
    pdf.setFillColor(0, 0, 0);
    pdf.setGState(new pdf.GState({ opacity: 0.05 }));
    pdf.roundedRect(x + 0.5, y + 0.5, width, height, radius, radius, 'F');
    pdf.setGState(new pdf.GState({ opacity: 1 }));
  };

  // Helper function for modern rounded rectangle
  const drawModernRect = (x: number, y: number, width: number, height: number, options: {
    fill?: boolean;
    stroke?: boolean;
    radius?: number;
    shadow?: boolean;
    color?: ColorTuple;
    borderColor?: ColorTuple;
    opacity?: number;
  } = {}) => {
    const {
      fill = true,
      stroke = false,
      radius = 2,
      shadow = false,
      color = colors.secondary,
      borderColor = colors.border,
      opacity
    } = options;

    if (shadow) {
      drawShadow(x, y, width, height, radius);
    }

    if (opacity !== undefined) {
      pdf.setGState(new (pdf as any).GState({ opacity }));
    }

    setFillColor(color);
    setDrawColor(borderColor);
    pdf.roundedRect(x, y, width, height, radius, radius, fill ? (stroke ? 'FD' : 'F') : 'S');

    if (opacity !== undefined) {
      pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
    }
  };

  // Calculate total weeks needed
  const totalWeeks = Math.ceil(selectedDrugs.reduce((max, drug) => 
    Math.max(max, drug.duration), 0) / 7);
  
  // Helper function to set text color safely
  const setTextColor = (color: ColorTuple) => {
    pdf.setTextColor(color[0], color[1], color[2]);
  };

  // Helper function to set fill color safely
  const setFillColor = (color: ColorTuple) => {
    pdf.setFillColor(color[0], color[1], color[2]);
  };

  // Helper function to set draw color safely
  const setDrawColor = (color: ColorTuple) => {
    pdf.setDrawColor(color[0], color[1], color[2]);
  };

  // Enhanced calendar drawing
  const drawTwoWeekCalendar = (startY: number, weekOffset: number) => {
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekHeaderHeight = 8;
    const dayHeaderHeight = 4;
    const timeSlotOffset = dayHeaderHeight + 1; // 5
    
    for (let week = 0; week < 2; week++) {
      const weekY = startY + (week * (cellHeight * timeSlots.length + weekSpacing));
      
      // Week header
      drawModernRect(margin, weekY - weekHeaderHeight, maxContentWidth, weekHeaderHeight, {
        color: colors.primary,
        shadow: true,
        radius: 3,
        opacity: 0.5
      });
      
      // Week label
      pdf.setFontSize(11);
      setTextColor(colors.text.white);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Week ${weekOffset + week + 1}`, margin + 5, weekY - weekHeaderHeight + 5);
      
      // Day headers
      weekDays.forEach((day, i) => {
        const x = margin + timeColumnWidth + (cellWidth * i);
        
        // Day header background
        drawModernRect(x, weekY, cellWidth, dayHeaderHeight, {
          color: colors.secondary,
          shadow: true,
          radius: 2
        });
        
        // Day name
        pdf.setFontSize(10);
        setTextColor(colors.text.dark);
        const textWidth = pdf.getTextWidth(day);
        pdf.text(day, x + (cellWidth - textWidth) / 2, weekY + dayHeaderHeight - 1);
      });

      // Time slots
      timeSlots.forEach((slot, i) => {
        const y = weekY + timeSlotOffset + (cellHeight * i);
        
        drawModernRect(margin, y, timeColumnWidth, cellHeight, {
          color: colors.accent,
          radius: 2
        });
        
        pdf.setFontSize(9);
        setTextColor(colors.text.dark);
        pdf.text(slot.label, margin + 2, y + (cellHeight / 2) + 1);
      });

      // Grid cells
      for (let day = 0; day < 7; day++) {
        const x = margin + timeColumnWidth + (cellWidth * day);
        const currentDate = addDays(startDate, ((weekOffset + week) * 7) + day);
        
        timeSlots.forEach((slot, slotIndex) => {
          const y = weekY + timeSlotOffset + (cellHeight * slotIndex);
          
          // Cell background
          drawModernRect(x, y, cellWidth, cellHeight, {
            color: colors.text.white,
            stroke: true,
            shadow: false,
            radius: 2,
            borderColor: colors.border
          });
          
          // Date display (top-left corner)
          if (slotIndex === 0) {
            pdf.setFontSize(9);
            setTextColor(colors.text.dark);
            pdf.setFont('helvetica', 'bold');
            const dateText = format(currentDate, 'd');
            pdf.text(dateText, x + 3, y + 5);
          }

          // Medication markers with improved organization
          const medicationsAtSlot = selectedDrugs.filter(drug => 
            isDrugActiveOnDate(drug, currentDate, startDate) && 
            shouldShowDrugAtTime(drug, slot)
          );

          if (medicationsAtSlot.length > 0) {
            const markerSize = 4;
            if (medicationsAtSlot.length === 1) {
              // Center the single marker exactly in the middle
              const markerX = x + (cellWidth - markerSize) / 2;
              const markerY = y + (cellHeight - markerSize) / 2;
              const drug = medicationsAtSlot[0];
              const drugColorSet = drugColorScheme[drug.effect];
              const bgColor = hexToRgb(drugColorSet.bg);
              const textColor = hexToRgb(drugColorSet.text);
              setFillColor(bgColor);
              pdf.rect(markerX, markerY, markerSize, markerSize, 'F');
              pdf.setFontSize(6);
              setTextColor(textColor);
              pdf.setFont('helvetica', 'bold');
              const numText = drug.sequenceNumber.toString();
              const numWidth = pdf.getTextWidth(numText);
              pdf.text(numText, markerX + (markerSize - numWidth) / 2, markerY + (markerSize * 0.7));
            } else {
              // Use grid layout for multiple markers.
              const markersPerRow = 4;
              const spacing = 1;
              const numRows = Math.ceil(medicationsAtSlot.length / markersPerRow);
              const gridHeight = numRows * markerSize + (numRows - 1) * spacing;
              const offsetY = y + (cellHeight - gridHeight) / 2;
              medicationsAtSlot.forEach((drug, index) => {
                const row = Math.floor(index / markersPerRow);
                const col = index % markersPerRow;
                // Determine number of markers in this row
                const markersInThisRow = (row === numRows - 1 && medicationsAtSlot.length % markersPerRow !== 0) ?
                  medicationsAtSlot.length % markersPerRow : markersPerRow;
                const rowWidth = markersInThisRow * markerSize + (markersInThisRow - 1) * spacing;
                const offsetX = x + (cellWidth - rowWidth) / 2;
                const markerX = offsetX + col * (markerSize + spacing);
                const markerY = offsetY + row * (markerSize + spacing);
                const drugColorSet = drugColorScheme[drug.effect];
                const bgColor = hexToRgb(drugColorSet.bg);
                const textColor = hexToRgb(drugColorSet.text);
                setFillColor(bgColor);
                pdf.rect(markerX, markerY, markerSize, markerSize, 'F');
                pdf.setFontSize(6);
                setTextColor(textColor);
                pdf.setFont('helvetica', 'bold');
                const numText = drug.sequenceNumber.toString();
                const numWidth = pdf.getTextWidth(numText);
                pdf.text(numText, markerX + (markerSize - numWidth) / 2, markerY + (markerSize * 0.7));
              });
            }
          }
        });
      }
    }

    return startY + (2 * (cellHeight * timeSlots.length + weekSpacing));
  };

  // Draw calendar pages with enhanced headers
  for (let pageIndex = 0; pageIndex < Math.ceil(totalWeeks / 2); pageIndex++) {
    if (pageIndex > 0) pdf.addPage();
    
    // Page title with shadow (moved further up to avoid overlapping the week header)
    drawModernRect(margin, margin - 16, pageWidth - (margin * 2), 12, {
      color: colors.primary,
      shadow: true,
      radius: 3,
      opacity: 0.5
    });
    
    pdf.setFontSize(12);
    setTextColor(colors.text.white);
    pdf.setFont('helvetica', 'bold');
    // Position the title inside the header rectangle
    pdf.text('Treatment Calendar', margin + 5, margin - 16 + 8);
    
    pdf.setFontSize(9);
    const startDateText = `Treatment Start: ${format(startDate, 'MMMM d, yyyy')}`;
    const dateWidth = pdf.getTextWidth(startDateText);
    pdf.text(startDateText, pageWidth - margin - dateWidth - 5, margin - 16 + 8);

    drawTwoWeekCalendar(margin + 6, pageIndex * 2);
  }

  // Legend page with enhanced styling
  pdf.addPage();
  
  const columnWidth = (pageWidth - (margin * 4)) / 3;
  const drugCategories = Object.entries(drugEffectInfo);
  const categoriesPerColumn = Math.ceil(drugCategories.length / 3);
  const [firstColumn, secondColumn, thirdColumn] = [
    drugCategories.slice(0, categoriesPerColumn),
    drugCategories.slice(categoriesPerColumn, categoriesPerColumn * 2),
    drugCategories.slice(categoriesPerColumn * 2)
  ];

  // Modern section headers with shadow
  const drawSectionHeader = (text: string, x: number, y: number) => {
    drawModernRect(x, y - 12, columnWidth, 10, {
      color: colors.primary,
      shadow: true,
      radius: 3,
      opacity: 0.5
    });
    
    pdf.setFontSize(11);
    setTextColor(colors.text.white);
    pdf.setFont('helvetica', 'bold');
    pdf.text(text, x + 5, y - 5);
  };

  // Draw categories with enhanced styling
  const drawCategories = (categories: [string, { benefits: string; sideEffects: string }][], x: number) => {
    let y = margin + 25;
    
    categories.forEach(([effect, info]) => {
      const drugColorSet = drugColorScheme[effect as DrugEffect];
      const bgColor = hexToRgb(drugColorSet.bg);
      
      // Category indicator
      drawModernRect(x, y - 6, 8, 8, {
        color: bgColor,
        radius: 2
      });
      
      // Category content
      pdf.setFontSize(9);
      setTextColor(colors.text.dark);
      pdf.setFont('helvetica', 'bold');
      pdf.text(
        effect.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        x + 12,
        y
      );
      
      // Info text
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      setTextColor(colors.text.light);
      
      const benefitsText = `Benefits: ${info.benefits}`;
      const sideEffectsText = `Side Effects: ${info.sideEffects}`;
      
      pdf.text(benefitsText, x + 12, y + 4, { maxWidth: columnWidth - 15 });
      pdf.text(sideEffectsText, x + 12, y + 8, { maxWidth: columnWidth - 15 });
      
      y += 16;
    });
  };

  // Draw legend sections
  [
    ['Categories A-H', margin, firstColumn],
    ['Categories I-P', margin + columnWidth + margin, secondColumn],
    ['Categories Q-Z', margin + (columnWidth + margin) * 2, thirdColumn]
  ].forEach(([title, x, categories]) => {
    drawSectionHeader(title as string, x as number, margin + 15);
    drawCategories(categories as [string, { benefits: string; sideEffects: string }][], x as number);
  });

  // Administration order section streamlined further
  const adminY = margin + 110;
  
  drawModernRect(margin, adminY, pageWidth - (margin * 2), 5, {
    color: colors.primary,
    shadow: true,
    radius: 3,
    opacity: 0.5
  });
  
  pdf.setFontSize(10);
  setTextColor(colors.text.white);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Drops Order (Seq,10-min gaps)', margin + 5, adminY + 4);

  // Example markers with improved layout
  const exampleY = adminY + 8;
  const exampleMarkerSize = 8;
  const exampleSpacing = 15;
  
  const orderedDrugs = [...selectedDrugs].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  
  orderedDrugs.forEach((drug, index) => {
    const drugColorSet = drugColorScheme[drug.effect];
    const markerX = margin + 5 + (index * (exampleMarkerSize + exampleSpacing));
    
    const bgColor = hexToRgb(drugColorSet.bg);
    const textColor = hexToRgb(drugColorSet.text);
    
    // Marker with shadow
    drawModernRect(markerX, exampleY, exampleMarkerSize, exampleMarkerSize, {
      color: bgColor,
      shadow: true,
      radius: 1
    });
    
    // Sequence number
    pdf.setFontSize(8);
    setTextColor(textColor);
    pdf.setFont('helvetica', 'bold');
    const numText = drug.sequenceNumber.toString();
    const numWidth = pdf.getTextWidth(numText);
    pdf.text(
      numText,
      markerX + (exampleMarkerSize - numWidth) / 2,
      exampleY + (exampleMarkerSize * 0.7)
    );
    
    // Drug name
    pdf.setFontSize(7);
    setTextColor(colors.text.light);
    pdf.setFont('helvetica', 'normal');
    const drugName = drug.name.length > 15 ? drug.name.substring(0, 12) + '...' : drug.name;
    pdf.text(drugName, markerX, exampleY + exampleMarkerSize + 5);
  });

  // Instructions with improved typography
  const instructionsY = exampleY + exampleMarkerSize + 15;
  pdf.setFontSize(8);
  setTextColor(colors.text.light);
  pdf.setFont('helvetica', 'normal');
  
  [
    '• Apply drops in numerical order as shown above',
    '• Wait 10 minutes between different drops',
    '• One drop per eye is sufficient',
    '• Close eyes gently for 2 minutes after each drop'
  ].forEach((instruction, index) => {
    pdf.text(instruction, margin + 5, instructionsY + (index * 5));
  });

  // Page numbers with refined styling
  const pages = (pdf as any).internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    setTextColor(colors.text.light);
    
    const pageText = `Page ${i} of ${pages}`;
    const pageNumWidth = pdf.getTextWidth(pageText);
    
    drawModernRect(
      pageWidth - margin - pageNumWidth - 8,
      pageHeight - margin - 8,
      pageNumWidth + 6,
      10,
      {
        color: colors.secondary,
        shadow: true,
        radius: 2
      }
    );
    
    pdf.text(
      pageText,
      pageWidth - margin - pageNumWidth - 5,
      pageHeight - margin
    );
  }

  // Enhanced PDF output handling
  try {
    const pdfOutput = pdf.output('dataurlstring');
    const link = document.createElement('a');
    link.href = pdfOutput;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    try {
      pdf.save(filename);
      return true;
    } catch (fallbackError) {
      console.error('Fallback download failed:', fallbackError);
      return false;
    }
  }
};

// Helper functions that don't need access to pdf instance
function isDrugActiveOnDate(drug: DrugType & { duration: number }, date: Date, startDate: Date): boolean {
  const endDate = addDays(startDate, drug.duration - 1);
  return !isBefore(date, startDate) && !isAfter(date, endDate);
}

function shouldShowDrugAtTime(
  drug: DrugType & { 
    posology: string;
    customSchedule?: { frequency: number; interval: number; startTime: string }
  },
  timeSlot: { hour: number; minute: number }
): boolean {
  if (drug.customSchedule) {
    const { frequency, interval, startTime } = drug.customSchedule;
    const [startHour] = startTime.split(':').map(Number);
    const hours = Array.from({ length: frequency }, (_, i) => (startHour + (i * interval)) % 24);
    return hours.includes(timeSlot.hour);
  }

  // Handle standard posology
  const standardSchedules: Record<string, number[]> = {
    'once': [8],
    'twice': [8, 20],
    'three': [8, 14, 20],
    'four': [8, 12, 16, 20]
  };

  const scheduleHours = standardSchedules[drug.posology] || [];
  return scheduleHours.includes(timeSlot.hour);
}