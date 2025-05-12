// src/utils/formatGameTimeDisplay.ts

// --- CORRECTED IMPORTS ---
// We need parseISO from date-fns base now
import { parseISO, format as formatBase } from 'date-fns';
// Keep toZonedTime and format from date-fns-tz
import { toZonedTime, format } from 'date-fns-tz';
// ------------------------

import { GameStatus } from "@/types/nba-games"; // Adjust path as needed

// Define source (assuming ET) and target timezones
const sourceTimeZone = 'America/New_York'; // IANA code for Eastern Time
const targetTimeZone = 'America/Chicago'; // IANA code for Central Time

/**
 * Helper function to parse date and time string assuming it's in ET.
 * Returns a Date object representing the correct UTC instant.
 * Uses an alternative method since zonedTimeToUtc might not be available.
 */
function parseETTimeAsUTC(dateStr: string, timeStr: string): Date | null {
    const timeMatch = timeStr.match(/(\d{1,2}:\d{2})\s*(am|pm)/i);
    if (!timeMatch) return null;

    const timePart = timeMatch[1]; // "7:30"
    const periodPart = timeMatch[2].toLowerCase(); // "pm"

    try {
        const dateParts = dateStr.split('-').map(Number); // [YYYY, MM, DD]
        const timeParts = timePart.split(':').map(Number); // [H, MM]
        let hours = timeParts[0];
        const minutes = timeParts[1];

        // Adjust hours for PM/AM
        if (periodPart === 'pm' && hours !== 12) hours += 12;
        if (periodPart === 'am' && hours === 12) hours = 0; // Midnight

        const year = dateParts[0];
        // Keep month/day 1-based for string formatting, but adjust for Date.UTC later
        const month = dateParts[1];
        const day = dateParts[2];

        // 1. Construct naive ISO-like string parts (zero-pad components)
        const isoTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
        const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const naiveIsoString = `${isoDate}T${isoTime}`; // e.g., "2025-05-15T19:30:00"

        // 2. Create a temporary Date object based on these components to check the offset.
        // We use Date.UTC to create a specific UTC instant based on the components.
        // Month needs to be 0-indexed for Date.UTC.
        const tempDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

        // 3. Get the correct UTC offset string for the source zone AT that specific instant.
        // 'XXX' format gives +/-HH:mm (e.g., "-04:00", "-05:00")
        const offsetString = format(tempDate, 'XXX', { timeZone: sourceTimeZone });

        // 4. Construct the full ISO 8601 string including the determined offset.
        const fullIsoString = `${naiveIsoString}${offsetString}`; // e.g., "2025-05-15T19:30:00-04:00"

        // 5. Parse this complete ISO string using parseISO from date-fns.
        // This reliably gives the correct UTC Date object.
        const utcDate = parseISO(fullIsoString);

        // Basic validation
        if (isNaN(utcDate.getTime())) {
            throw new Error(`Failed to parse final ISO string: ${fullIsoString}`);
        }

        return utcDate;

    } catch (e) {
        console.error(`Error parsing time string as ET: dateStr='${dateStr}', timeStr='${timeStr}'`, e);
        return null;
    }
}


/**
 * Formats the game time display, converting ET times to Central Time (America/Chicago).
 * (The rest of this function remains the same - it correctly uses the utcDate
 * returned by the helper and converts it using toZonedTime)
 */
export function formatGameTimeDisplay(status: GameStatus, dateStr: string, timeStr: string): string {

    const cleanTimeStr = timeStr.trim();
    const timeRegex = /\d{1,2}:\d{2}\s*(am|pm)\s*ET/i;
    const isETTime = timeRegex.test(cleanTimeStr);
    let formattedTimePart = cleanTimeStr;

    if (status === 'UPCOMING' && isETTime) {
        // Call the updated helper function
        const utcDate = parseETTimeAsUTC(dateStr, cleanTimeStr);

        if (utcDate) {
            try {
                // Convert the resulting UTC Date to the target Chicago timezone
                const zonedTime = toZonedTime(utcDate, targetTimeZone);

                // Format the time in the target timezone
                formattedTimePart = format(zonedTime, 'h:mm a', { timeZone: targetTimeZone });

            } catch (e) {
                console.error("Error converting/formatting timezone:", e);
                formattedTimePart = cleanTimeStr; // Fallback
            }
        } else {
            formattedTimePart = cleanTimeStr; // Fallback if parsing failed
        }
    } else if (status === 'UPCOMING' && cleanTimeStr.toUpperCase() === 'TBD') {
        formattedTimePart = "Time TBD";
    } else if (status === 'LIVE' || status === 'FINISHED') {
        formattedTimePart = cleanTimeStr;
    }

    // --- Combine with Date Prefix ---
    try {
        const gameDate = new Date(dateStr + 'T00:00:00Z');
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setUTCDate(today.getUTCDate() + 1);
        today.setUTCHours(0, 0, 0, 0);
        tomorrow.setUTCHours(0, 0, 0, 0);

        let datePrefix = '';
        if (gameDate.getTime() === today.getTime()) {
            datePrefix = 'Today, ';
        } else if (gameDate.getTime() === tomorrow.getTime()) {
            datePrefix = 'Tomorrow, ';
        } else {
            // Use formatBase from date-fns for simple date formatting
            datePrefix = formatBase(gameDate, 'MMM d') + ', ';
        }

        if (formattedTimePart === "Time TBD") {
            return `${datePrefix}${formattedTimePart}`;
        }

        return `${datePrefix}${formattedTimePart}`;

    } catch (e) {
        console.error("Error formatting date prefix:", e);
        return formattedTimePart;
    }
}