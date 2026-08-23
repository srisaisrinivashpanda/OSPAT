package com.hospitality.sample;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@Slf4j
public class SamplePdfGeneratorService {

    public byte[] generateStarHealthSamplePdf() throws IOException {
        String title = "STAR HEALTH AND ALLIED INSURANCE COMPANY LIMITED";
        String subtitle = "POLICY SCHEDULE - FAMILY HEALTH OPTIMA INSURANCE PLAN";
        String[] lines = {
                "Policy Number: P/111122/01/2026/004589",
                "Policyholder: Rajesh Verma | Age: 58 Years | Proposer",
                "Insurer Name: Star Health Allied Insurance",
                "Policy Plan: Family Health Optima Comprehensive",
                "Basic Sum Insured / Coverage Limit: Rs. 5,00,000 (Five Lakhs Only)",
                "Cumulative Bonus / Restore Benefit: Available up to 100%",
                "Daily Room Rent Limit: Up to Rs. 5,000 per day",
                "Eligible Room Category: Semi-Private Room (Twin Sharing AC)",
                "Network Hospital Tie-ups: Apex Multi-Specialty Hospital, Metro Care Medical Institute, St. Jude Memorial Health Center, Zenith Super Speciality Hospital, Fortis Escorts Care Center, Manipal Lifecare Hospital, Narayana Health City, Columbia Asia Care Hospital",
                "",
                "TERMS & KEY EXCLUSIONS:",
                "1. Pre-existing diseases covered after 36 continuous months of insurance.",
                "2. Cosmetic, aesthetic, and obesity-related surgical interventions are not covered.",
                "3. Non-medical consumables (gloves, masks, syringes, admission kit) are non-payable.",
                "4. Hospitalization solely for diagnostic investigation without active line of treatment is excluded.",
                "5. Cashless pre-authorization must be initiated at least 48 hours prior to planned hospital admission.",
                "",
                "IMPORTANT NOTICE:",
                "This document is a synthetic insurance schedule generated for testing and demonstration purposes.",
                "Verify final coverage and pre-authorization approvals with Star Health TPA Helpdesk."
        };
        return renderPdf(title, subtitle, lines);
    }

    public byte[] generateHdfcErgoSamplePdf() throws IOException {
        String title = "HDFC ERGO GENERAL INSURANCE COMPANY LIMITED";
        String subtitle = "POLICY SCHEDULE - OPTIMA RESTORE HEALTH INSURANCE";
        String[] lines = {
                "Policy Number: HDFC/OPT/2026/9823114",
                "Policyholder: Anita Verma | Age: 54 Years",
                "Insurer Name: HDFC ERGO Health Insurance",
                "Policy Plan: Optima Restore Individual Cover",
                "Basic Sum Insured / Coverage Limit: Rs. 10,00,000 (Ten Lakhs Only)",
                "Automatic Restore Benefit: 100% Instant Restoration upon exhaustion",
                "Daily Room Rent Limit: Rs. 8,000 per day (Single Private AC Room)",
                "Eligible Room Category: Single Private Room AC",
                "Network Hospital Tie-ups: Apex Multi-Specialty Hospital, Metro Care Medical Institute, St. Jude Memorial Health Center, Fortis Escorts Care Center, Manipal Lifecare Hospital, Narayana Health City, Aster CMI Healthcare, Columbia Asia Care Hospital",
                "",
                "TERMS & KEY EXCLUSIONS:",
                "1. 24-month waiting period for specific pre-defined ailments and joint replacement surgeries.",
                "2. Maternity and newborn care expenses excluded unless explicitly purchased with Gold Add-on.",
                "3. Dental treatment and procedures unless necessitated by accidental trauma requiring hospitalization.",
                "4. Outpatient consultation pharmacy costs outside 60-day pre/90-day post hospitalization window.",
                "5. Proportionate deduction clause applies if room category exceeds Single Private Room limit.",
                "",
                "IMPORTANT NOTICE:",
                "Synthetic sample policy document generated for the Hospitality decision-support hackathon demonstration."
        };
        return renderPdf(title, subtitle, lines);
    }

    public byte[] generateCareHealthSamplePdf() throws IOException {
        String title = "CARE HEALTH INSURANCE LIMITED";
        String subtitle = "CERTIFICATE OF INSURANCE - CARE ADVANTAGE SENIOR";
        String[] lines = {
                "Policy Number: CHI/CADV/2026/339102",
                "Policyholder: Ramesh Rao | Age: 67 Years",
                "Insurer Name: Care Health Insurance",
                "Policy Plan: Care Advantage Senior Protection",
                "Basic Sum Insured / Coverage Limit: Rs. 7,50,000 (Seven Lakh Fifty Thousand Only)",
                "Daily Room Rent Limit: Rs. 4,000 per day",
                "Eligible Room Category: Semi-Private (Twin Sharing)",
                "Network Hospital Tie-ups: Apex Multi-Specialty Hospital, Metro Care Medical Institute, Zenith Super Speciality Hospital, Narayana Health City, Columbia Asia Care Hospital, Lifeline Community Hospital",
                "",
                "TERMS & KEY EXCLUSIONS:",
                "1. Co-payment of 10% applicable on all claims due to senior citizen entry age bracket.",
                "2. Pre-existing illness waiting period: 24 months from inception date.",
                "3. AYUSH alternative treatments covered up to 20% of the Basic Sum Insured.",
                "4. Non-payable consumable items and administrative processing charges borne by patient.",
                "",
                "IMPORTANT NOTICE:",
                "Synthetic demonstration insurance policy for the Hospitality platform."
        };
        return renderPdf(title, subtitle, lines);
    }

    private byte[] renderPdf(String title, String subtitle, String[] lines) throws IOException {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            try (PDPageContentStream stream = new PDPageContentStream(doc, page)) {
                PDType1Font boldFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font regularFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

                float y = 780;
                // Header
                stream.beginText();
                stream.setFont(boldFont, 14);
                stream.newLineAtOffset(50, y);
                stream.showText(title);
                stream.endText();

                y -= 20;
                stream.beginText();
                stream.setFont(boldFont, 11);
                stream.newLineAtOffset(50, y);
                stream.showText(subtitle);
                stream.endText();

                y -= 25;
                for (String line : lines) {
                    if (y < 60) break;
                    stream.beginText();
                    if (line.startsWith("TERMS") || line.startsWith("IMPORTANT") || line.startsWith("Policy Number")) {
                        stream.setFont(boldFont, 10);
                    } else {
                        stream.setFont(regularFont, 9.5f);
                    }
                    stream.newLineAtOffset(50, y);
                    stream.showText(line);
                    stream.endText();
                    y -= 16;
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.save(baos);
            return baos.toByteArray();
        }
    }
}
