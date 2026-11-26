/**
 * WhatsApp Gateway Utility for Vishwakarma Web Private Limited
 * Integrates with https://wapi.digiadharseva.com/api/send-message
 */

const WHATSAPP_API_URL =
  process.env.WHATSAPP_API_URL || "https://wapi.digiadharseva.com/api/send-message";
const WHATSAPP_API_KEY =
  process.env.WHATSAPP_API_KEY || "ihBHrY6xveDwi2aD0b2sxJXfGqRE69RO";
const ADMIN_WHATSAPP_NUMBER =
  process.env.ADMIN_WHATSAPP_NUMBER || "7978290952";

/**
 * Clean phone number to 10-digit format for Indian WhatsApp Gateway
 */
export const formatWhatsAppNumber = (phone) => {
  if (!phone) return "";
  let cleaned = phone.toString().replace(/\D/g, "");

  // If starts with country code 91 and has 12 digits, strip 91
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.length === 11 && cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.length > 10) {
    cleaned = cleaned.slice(-10);
  }

  return cleaned;
};

/**
 * Send WhatsApp text message via DigiAdharSeva WAPI gateway
 */
export const sendWhatsAppMessage = async ({
  number,
  message,
  footer = "Vishwakarma Web Private Limited",
}) => {
  try {
    const cleanNumber = formatWhatsAppNumber(number);
    if (!cleanNumber || cleanNumber.length < 10) {
      console.warn(`[WhatsApp API] Skipped: Invalid phone number '${number}'`);
      return { success: false, message: "Invalid phone number" };
    }

    const payload = {
      api_key: WHATSAPP_API_KEY,
      number: cleanNumber,
      message: message,
      type: "text",
      footer: footer || "Vishwakarma Web Private Limited",
    };

    const response = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (data.status === true || response.ok) {
      console.log(`[WhatsApp API] Message sent successfully to ${cleanNumber}`);
      return { success: true, data };
    } else {
      console.warn(`[WhatsApp API] Gateway response for ${cleanNumber}:`, data);
      return { success: false, data };
    }
  } catch (error) {
    console.error(`[WhatsApp API] Network error sending to ${number}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send automated confirmation to inquirer & alert to Admin upon Contact Us / Inquiry submission
 */
export const sendInquiryWhatsAppNotification = async ({
  fullName,
  phone,
  email,
  state = "All",
  companyName = "",
  serviceRequired = "General Consultation",
  projectBudget = "",
  projectTimeline = "",
  projectDescription = "",
}) => {
  try {
    const clientNumber = formatWhatsAppNumber(phone);

    // 1. Personalized confirmation message to the visitor
    const clientMessage = `Namaste ${fullName || "Valued Client"}! 🙏

Thank you for contacting *Vishwakarma Web Private Limited*. We have received your inquiry.

📋 *Inquiry Details:*
• *Service:* ${serviceRequired || "Technology Services"}
• *Requirement:* ${projectDescription || "General Consultation"}
${companyName ? `• *Company:* ${companyName}\n` : ""}${projectBudget ? `• *Budget:* ${projectBudget}\n` : ""}${projectTimeline ? `• *Timeline:* ${projectTimeline}\n` : ""}
Our senior technical architect will review your specifications and contact you within 24 business hours.

🌐 *Website:* https://vishwakarmaweb.com
📞 *Direct Helpline:* +91 7684931759 / 7008156600

Warm regards,
*Vishwakarma Web Solutions Team*`;

    // Send confirmation to client
    if (clientNumber) {
      await sendWhatsAppMessage({
        number: clientNumber,
        message: clientMessage,
        footer: "Vishwakarma Web Private Limited",
      });
    }

    // 2. Alert notification to Company Admin
    const adminNumber = formatWhatsAppNumber(ADMIN_WHATSAPP_NUMBER);
    if (adminNumber && adminNumber !== clientNumber) {
      const adminAlert = `🔔 *New Website Inquiry Received!*

👤 *Name:* ${fullName || "N/A"}
📱 *Mobile:* ${phone || "N/A"}
📧 *Email:* ${email || "N/A"}
🏢 *Company:* ${companyName || "N/A"}
📍 *State:* ${state || "N/A"}
🛠 *Service:* ${serviceRequired || "General Inquiry"}
💰 *Budget:* ${projectBudget || "Not specified"}
⏱ *Timeline:* ${projectTimeline || "Not specified"}
📝 *Requirement:* ${projectDescription || "N/A"}`;

      await sendWhatsAppMessage({
        number: adminNumber,
        message: adminAlert,
        footer: "Vishwakarma Web Inbound Lead Alert",
      });
    }

    return { success: true };
  } catch (error) {
    console.error("[WhatsApp API] Failed in sendInquiryWhatsAppNotification:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send automated confirmation for Price Calculator / Quote requests
 */
export const sendQuoteWhatsAppNotification = async ({
  fullName,
  phone,
  email,
  state = "All",
  companyName = "",
  serviceName = "Custom Solution",
  serviceCategory = "Enterprise Development",
  projectBudget = "",
  timeline = "",
  projectDescription = "",
}) => {
  try {
    const clientNumber = formatWhatsAppNumber(phone);

    const clientMessage = `Namaste ${fullName || "Valued Client"}! 🙏

Thank you for requesting a project quote with *Vishwakarma Web Private Limited*.

📋 *Quote Request Summary:*
• *Service Category:* ${serviceCategory}
• *Target Service:* ${serviceName}
${projectBudget ? `• *Budget Range:* ${projectBudget}\n` : ""}${timeline ? `• *Timeline:* ${timeline}\n` : ""}• *Scope:* ${projectDescription || "Initial consultation"}

Our solutions architect is preparing an architectural breakdown and proposal for your review. We will contact you shortly.

🌐 *Website:* https://vishwakarmaweb.com
📞 *Direct Helpline:* +91 7684931759 / 7008156600

Best Regards,
*Vishwakarma Web Solutions Team*`;

    if (clientNumber) {
      await sendWhatsAppMessage({
        number: clientNumber,
        message: clientMessage,
        footer: "Vishwakarma Web Private Limited",
      });
    }

    const adminNumber = formatWhatsAppNumber(ADMIN_WHATSAPP_NUMBER);
    if (adminNumber && adminNumber !== clientNumber) {
      const adminAlert = `🔔 *New Project Quote Request!*

👤 *Name:* ${fullName || "N/A"}
📱 *Mobile:* ${phone || "N/A"}
📧 *Email:* ${email || "N/A"}
🛠 *Service:* ${serviceName || serviceCategory}
💰 *Budget:* ${projectBudget || "N/A"}
⏱ *Timeline:* ${timeline || "N/A"}
📝 *Scope:* ${projectDescription || "N/A"}`;

      await sendWhatsAppMessage({
        number: adminNumber,
        message: adminAlert,
        footer: "Vishwakarma Web Quote Alert",
      });
    }

    return { success: true };
  } catch (error) {
    console.error("[WhatsApp API] Failed in sendQuoteWhatsAppNotification:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send automated WhatsApp update to client when a Telecaller/Admin adds a call log note
 */
export const sendCallLogWhatsAppNotification = async ({
  fullName,
  phone,
  serviceName = "Technology Services",
  noteText,
  status = "",
}) => {
  try {
    const clientNumber = formatWhatsAppNumber(phone);
    const trimmedNote = typeof noteText === "string" ? noteText.trim() : "";

    if (!clientNumber || !trimmedNote) {
      return { success: false, message: "Missing phone number or call log message" };
    }

    const clientMessage = `*Vishwakarma Web Private Limited*

${trimmedNote}

Warm regards,
*Vishwakarma Web Solutions Team*`;

    return await sendWhatsAppMessage({
      number: clientNumber,
      message: clientMessage,
      footer: "Vishwakarma Web Private Limited",
    });
  } catch (error) {
    console.error("[WhatsApp API] Failed in sendCallLogWhatsAppNotification:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send automated WhatsApp confirmation to client when a Deal is confirmed/submitted
 */
export const sendDealWhatsAppNotification = async ({
  fullName,
  phone,
  category = "Web Development",
  dealValue = 0,
  advanceAmount = 0,
  estimatedDays = 30,
  projectScope = "",
}) => {
  try {
    const clientNumber = formatWhatsAppNumber(phone);
    if (!clientNumber) {
      return { success: false, message: "Invalid phone number" };
    }

    const detailsLine = [
      `Namaste ${fullName || "Valued Client"}! Your deal for *${category}* has been confirmed.`,
      `• *Total Deal Value:* ₹${Number(dealValue || 0).toLocaleString("en-IN")}`,
      `• *Advance Collected:* ₹${Number(advanceAmount || 0).toLocaleString("en-IN")}`,
      `• *Estimated Delivery:* ${Number(estimatedDays || 30)} Days`,
      projectScope?.trim() ? `• *Scope:* ${projectScope.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const clientMessage = `*Vishwakarma Web Private Limited - Deal Confirmed*

${detailsLine}

Warm regards,
*Vishwakarma Web Solutions Team*`;

    return await sendWhatsAppMessage({
      number: clientNumber,
      message: clientMessage,
      footer: "Vishwakarma Web Private Limited",
    });
  } catch (error) {
    console.error("[WhatsApp API] Failed in sendDealWhatsAppNotification:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send automated WhatsApp message with Client Portal login credentials upon Deal Approval
 */
export const sendDealApprovedWhatsAppNotification = async ({
  fullName,
  phone,
  email = "",
  clientId,
  tempPassword,
  projectId,
  projectName = "",
}) => {
  try {
    const clientNumber = formatWhatsAppNumber(phone);
    if (!clientNumber) {
      return { success: false, message: "Invalid phone number" };
    }

    const loginDetails = [
      `Namaste ${fullName || "Valued Client"}! Your deal has been approved and your Client Portal account is ready.`,
      `• *Client ID:* ${clientId}`,
      `• *Login Mobile:* ${phone}`,
      email ? `• *Email:* ${email}` : "",
      `• *Initial Password:* ${tempPassword}`,
      `• *Project ID:* ${projectId}`,
      projectName ? `• *Project:* ${projectName}` : "",
      `• *Login Portal:* https://vishwakarmaweb.com/login`,
    ]
      .filter(Boolean)
      .join("\n");

    const clientMessage = `*Vishwakarma Web Private Limited - Deal Approved & Login Details*

${loginDetails}

Warm regards,
*Vishwakarma Web Solutions Team*`;

    return await sendWhatsAppMessage({
      number: clientNumber,
      message: clientMessage,
      footer: "Vishwakarma Web Private Limited",
    });
  } catch (error) {
    console.error("[WhatsApp API] Failed in sendDealApprovedWhatsAppNotification:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send automated WhatsApp notifications when Project Team is assigned/updated
 */
export const sendTeamAssignmentWhatsAppNotification = async ({
  projectName,
  projectId = "",
  category = "Web Development",
  client = null,
  projectManager = null,
  qaTester = null,
  telecaller = null,
  developers = [],
}) => {
  try {
    const recipientMap = new Map();

    const addRole = (member, roleLabel) => {
      if (!member || !member._id) return;
      const id = member._id.toString();
      if (!recipientMap.has(id)) {
        recipientMap.set(id, { member, roles: [] });
      }
      const entry = recipientMap.get(id);
      if (!entry.roles.includes(roleLabel)) {
        entry.roles.push(roleLabel);
      }
    };

    addRole(projectManager, "Project Manager");
    addRole(qaTester, "QA Tester");
    addRole(telecaller, "Telecaller");
    if (Array.isArray(developers)) {
      developers.forEach((dev) => addRole(dev, "Developer"));
    }

    const tasks = [];

    for (const { member, roles } of recipientMap.values()) {
      const cleanNum = formatWhatsAppNumber(member.phone);
      if (!cleanNum) continue;

      const memberMsg = `*Vishwakarma Web Private Limited - Project Team Assigned*

Namaste ${member.name || "Team Member"}! You have been assigned to a project:
• *Project:* ${projectName || "Client Project"}
• *Project ID:* ${projectId || "N/A"}
• *Role:* ${roles.join(", ")}
• *Category:* ${category || "Web Development"}
• *Portal:* https://vishwakarmaweb.com/login

Warm regards,
*Vishwakarma Web Solutions Team*`;

      tasks.push(
        sendWhatsAppMessage({
          number: cleanNum,
          message: memberMsg,
          footer: "Vishwakarma Web Private Limited",
        })
      );
    }

    const clientNumber = formatWhatsAppNumber(client?.phone);
    if (clientNumber && recipientMap.size > 0) {
      const devNames = Array.isArray(developers)
        ? developers.map((d) => d?.name).filter(Boolean).join(", ")
        : "";
      const summaryLines = [
        `Namaste ${client?.name || "Valued Client"}! Your project team has been assigned for *${projectName || "your project"}*${projectId ? ` (${projectId})` : ""}:`,
        projectManager?.name ? `• *Project Manager:* ${projectManager.name}` : "",
        qaTester?.name ? `• *QA Tester:* ${qaTester.name}` : "",
        devNames ? `• *Developers:* ${devNames}` : "",
        `• *Portal:* https://vishwakarmaweb.com/login`,
      ]
        .filter(Boolean)
        .join("\n");

      const clientMsg = `*Vishwakarma Web Private Limited - Project Team Update*

${summaryLines}

Warm regards,
*Vishwakarma Web Solutions Team*`;

      tasks.push(
        sendWhatsAppMessage({
          number: clientNumber,
          message: clientMsg,
          footer: "Vishwakarma Web Private Limited",
        })
      );
    }

    if (tasks.length === 0) {
      return { success: false, sentCount: 0, totalAttempted: 0 };
    }

    const results = await Promise.allSettled(tasks);
    const sentCount = results.filter(
      (r) => r.status === "fulfilled" && r.value?.success
    ).length;

    return {
      success: sentCount > 0,
      sentCount,
      totalAttempted: tasks.length,
    };
  } catch (error) {
    console.error("[WhatsApp API] Failed in sendTeamAssignmentWhatsAppNotification:", error.message);
    return { success: false, sentCount: 0, error: error.message };
  }
};

/**
 * Send automated WhatsApp notification with meeting link & schedule details to client and assigned team
 */
export const sendMeetingWhatsAppNotification = async ({
  projectName,
  projectId = "",
  title,
  meetingDate,
  startTime = "",
  meetingLink = "",
  agenda = "",
  recipients = [],
}) => {
  try {
    const uniqueRecipients = new Map();
    if (Array.isArray(recipients)) {
      recipients.forEach((user) => {
        if (!user?.phone) return;
        const cleanNum = formatWhatsAppNumber(user.phone);
        if (!cleanNum) return;
        if (!uniqueRecipients.has(cleanNum)) {
          uniqueRecipients.set(cleanNum, { name: user.name || "Team Member", phone: cleanNum });
        }
      });
    }

    if (uniqueRecipients.size === 0) {
      return { success: false, sentCount: 0, totalAttempted: 0 };
    }

    const formattedDate = meetingDate
      ? new Date(meetingDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Scheduled Date";

    const tasks = Array.from(uniqueRecipients.values()).map(({ name, phone }) => {
      const details = [
        `Namaste ${name}! A project meeting has been scheduled:`,
        `• *Project:* ${projectName || "Project"}${projectId ? ` (${projectId})` : ""}`,
        `• *Meeting:* ${title || "Project Sync"}`,
        `• *Date & Time:* ${formattedDate}${startTime ? ` at ${startTime}` : ""}`,
        meetingLink?.trim() ? `• *Meet Link:* ${meetingLink.trim()}` : "",
        agenda?.trim() ? `• *Agenda:* ${agenda.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const msg = `*Vishwakarma Web Private Limited - Meeting Scheduled*

${details}

Warm regards,
*Vishwakarma Web Solutions Team*`;

      return sendWhatsAppMessage({
        number: phone,
        message: msg,
        footer: "Vishwakarma Web Private Limited",
      });
    });

    const results = await Promise.allSettled(tasks);
    const sentCount = results.filter(
      (r) => r.status === "fulfilled" && r.value?.success
    ).length;

    return {
      success: sentCount > 0,
      sentCount,
      totalAttempted: tasks.length,
    };
  } catch (error) {
    console.error("[WhatsApp API] Failed in sendMeetingWhatsAppNotification:", error.message);
    return { success: false, sentCount: 0, error: error.message };
  }
};

/**
 * Send automated WhatsApp notification to client when a new Invoice is generated
 */
export const sendInvoiceWhatsAppNotification = async ({
  fullName,
  phone,
  projectName = "",
  projectId = "",
  invoiceNumber = "",
  title = "",
  amount = 0,
  dueDate = null,
  notes = "",
}) => {
  try {
    const clientNumber = formatWhatsAppNumber(phone);
    if (!clientNumber) {
      return { success: false, message: "Invalid phone number" };
    }

    const formattedDue = dueDate
      ? new Date(dueDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

    const details = [
      `Namaste ${fullName || "Valued Client"}! A new invoice has been generated for your project:`,
      projectName ? `• *Project:* ${projectName}${projectId ? ` (${projectId})` : ""}` : "",
      invoiceNumber ? `• *Invoice #:* ${invoiceNumber}` : "",
      title ? `• *Description:* ${title}` : "",
      `• *Amount:* ₹${Number(amount || 0).toLocaleString("en-IN")}`,
      formattedDue ? `• *Due Date:* ${formattedDue}` : "",
      notes?.trim() ? `• *Notes:* ${notes.trim()}` : "",
      `• *Status:* PENDING`,
      `• *Portal:* https://vishwakarmaweb.com/login`,
    ]
      .filter(Boolean)
      .join("\n");

    const clientMessage = `*Vishwakarma Web Private Limited - Invoice Generated*

${details}

Warm regards,
*Vishwakarma Web Solutions Team*`;

    return await sendWhatsAppMessage({
      number: clientNumber,
      message: clientMessage,
      footer: "Vishwakarma Web Private Limited",
    });
  } catch (error) {
    console.error("[WhatsApp API] Failed in sendInvoiceWhatsAppNotification:", error.message);
    return { success: false, error: error.message };
  }
};
