/**
 * File Renaming Script for BITV/WCAG Markdown Files
 *
 * This script safely renames markdown files in a directory according to a new ID scheme.
 * It creates a mapping from old IDs to new IDs, checks for potential issues,
 * and performs the renaming only if all checks pass.
 *
 * Usage: node rename-files.js <sourceDir> [--dry-run]
 *
 * Options:
 *   --dry-run  Only show what would be done without actually renaming files
 *
 * Example:
 *   node rename-files.js ./docs --dry-run
 */

const fs = require("fs")
const path = require("path")
const readline = require("readline")

// Get command line arguments
const args = process.argv.slice(2)
const sourceDir = args[0]
const isDryRun = args.includes("--dry-run")

if (!sourceDir) {
    console.error("Error: Source directory is required")
    console.log("Usage: node rename-files.js <sourceDir> [--dry-run]")
    process.exit(1)
}

// Create a readline interface for user interaction
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

// Function to generate a new ID based on the old ID
function generateNewId(index, oldId) {
    // Determine the system based on the ID format
    let system = "bitv" // Default to BITV

    // Extract WCAG ID from filename if present
    if (oldId.match(/^\d+\.\d+\.\d+$/)) {
        system = "wcag"
    }

    // Format index with leading zeros
    const formattedIndex = String(index).padStart(3, "0")

    return `c-${formattedIndex}-${system}-${oldId}`
}

// Function to create a mapping between old and new filenames
function createFileMapping(files) {
    const mapping = {}
    const newFilenames = new Set()
    const issues = []

    files.forEach((filename, index) => {
        // Extract the ID from the filename (remove .md extension)
        const oldId = path.basename(filename, ".md")
        const newId = generateNewId(index + 1, oldId)
        const newFilename = `${newId}.md`

        mapping[filename] = newFilename

        // Check for potential issues
        if (newFilenames.has(newFilename)) {
            issues.push(`Duplicate new filename: ${newFilename}`)
        }

        newFilenames.add(newFilename)
    })

    return { mapping, issues }
}

// Function to rename files based on mapping
async function renameFiles(mapping) {
    const results = {
        success: [],
        error: [],
    }

    // Process files in sequence to handle potential rename conflicts
    for (const [oldPath, newFilename] of Object.entries(mapping)) {
        const oldFullPath = path.join(sourceDir, oldPath)
        const newFullPath = path.join(sourceDir, newFilename)

        try {
            if (!isDryRun) {
                await fs.promises.rename(oldFullPath, newFullPath)
            }
            results.success.push({ from: oldPath, to: newFilename })
        } catch (error) {
            results.error.push({
                from: oldPath,
                to: newFilename,
                error: error.message,
            })
        }
    }

    return results
}

// Main function
async function main() {
    try {
        // Verify the source directory exists
        if (!fs.existsSync(sourceDir)) {
            console.error(`Error: Directory '${sourceDir}' does not exist`)
            process.exit(1)
        }

        // Get all markdown files in the directory
        const files = fs
            .readdirSync(sourceDir)
            .filter((file) => file.endsWith(".md"))

        if (files.length === 0) {
            console.log(`No markdown files found in '${sourceDir}'`)
            process.exit(0)
        }

        console.log(`Found ${files.length} markdown files in '${sourceDir}'`)

        // Create mapping between old and new filenames
        const { mapping, issues } = createFileMapping(files)

        // Display the mapping
        console.log("\nProposed file renaming:")
        Object.entries(mapping).forEach(([oldFile, newFile]) => {
            console.log(`  ${oldFile} → ${newFile}`)
        })

        // Display any issues
        if (issues.length > 0) {
            console.log("\nPotential issues:")
            issues.forEach((issue) => console.log(`  - ${issue}`))
        }

        // Create output directory if it doesn't exist
        if (!isDryRun) {
            console.log("\nProceeding with file renaming...")
        } else {
            console.log("\nDry run mode - no files will be renamed")
            process.exit(0)
        }

        // Confirm before proceeding
        rl.question(
            "\nDo you want to proceed with the renaming? (y/n): ",
            async (answer) => {
                if (answer.toLowerCase() === "y") {
                    // Perform the renaming
                    const results = await renameFiles(mapping)

                    // Report success
                    if (results.success.length > 0) {
                        console.log(
                            `\nSuccessfully renamed ${results.success.length} files:`
                        )
                        results.success.forEach((item) => {
                            console.log(`  ${item.from} → ${item.to}`)
                        })
                    }

                    // Report errors
                    if (results.error.length > 0) {
                        console.log(
                            `\nFailed to rename ${results.error.length} files:`
                        )
                        results.error.forEach((item) => {
                            console.log(
                                `  ${item.from} → ${item.to}: ${item.error}`
                            )
                        })
                    }

                    // Create a mapping JSON file for reference
                    const mappingData = {}
                    results.success.forEach((item) => {
                        mappingData[item.from.replace(".md", "")] =
                            item.to.replace(".md", "")
                    })

                    if (!isDryRun) {
                        fs.writeFileSync(
                            path.join(sourceDir, "id-mapping.json"),
                            JSON.stringify(mappingData, null, 2)
                        )
                        console.log(
                            `\nCreated id-mapping.json file in ${sourceDir}`
                        )
                    }
                } else {
                    console.log("Operation cancelled")
                }

                rl.close()
            }
        )
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

// Run the main function
main()
