import { writeFileSync, existsSync, readFileSync } from 'fs';
import { mkdirSync } from 'fs';

import { getHub, getCentral, parseHub, parseCentral, mergeCourses } from '../src/lib/fetch.js';

// Import existing course data for comparison
import { courses as dataCourses } from '../src/lib/data.js';

mkdirSync('tests/output', { recursive: true });

function writeJSON(filename, json) {
  writeFileSync(filename, JSON.stringify(json, null, 2));
}

async function testFetch() {
  const timestamp = new Date().toISOString();
  const results = {
    timestamp,
    hubResult: null,
    centralResult: null
  };

  try {
    console.log('Testing data fetch...\n');


    let hubData = null;
    if (existsSync('tests/output/hub-data.json')) {
      const hubF = JSON.parse(readFileSync('tests/output/hub-data.json', 'utf8'));
      hubData = hubF;
    } else {
      try {
        hubData = await getHub();
        console.log('✅ OMSHub Success! Found', Object.keys(hubData).length, 'courses');
      } catch (error) {
        results.hubResult = {
          success: false,
          error: error.message
        };
        console.log('❌ OMSHub Error:', error.message);
      }
    }
    results.hubResult = {
      success: true,
      courseCount: Object.keys(hubData).length,
      sampleCourse: Object.values(hubData)[0],
      data: hubData
    };

    let centralData = null;
    if (existsSync('tests/output/central-data.json')) {
      const centralF = JSON.parse(readFileSync('tests/output/central-data.json', 'utf8'));
      centralData = centralF;
    } else {
      try {
        centralData = await getCentral();
        console.log('✅ OMSCentral Success! Found', centralData.length, 'courses');
      } catch (error) {
        results.centralResult = {
          success: false,
          error: error.message
        };
        console.log('❌ OMSCentral Error:', error.message);
      }
    }
    results.centralResult = {
      success: true,
      courseCount: centralData.length,
      sampleCourse: centralData[0],
      data: centralData
    };

    // Test merging if both sources succeeded
    if (hubData && centralData) {
      try {
        const parsedHub = parseHub(hubData);
        const parsedCentral = parseCentral(centralData);
        const mergedData = mergeCourses(parsedHub, parsedCentral);

        results.mergedResult = {
          success: true,
          courseCount: Object.keys(mergedData).length,
          sampleCourse: Object.values(mergedData)[0],
          data: mergedData
        };
        console.log(
          '✅ Merge Success! Found', Object.keys(mergedData).length, 'merged courses'
        );
      } catch (error) {
        results.mergedResult = {
          success: false,
          error: error.message
        };
        console.log('❌ Merge Error:', error.message);
      }
    } else {
      results.mergedResult = {
        success: false,
        error: 'Cannot merge - one or both data sources failed'
      };
      console.log('❌ Merge skipped - missing data sources');
    }

    if (results.hubResult?.success) {
      writeJSON('tests/output/hub-data.json', results.hubResult.data);
    }

    if (results.centralResult?.success) {
      writeJSON('tests/output/central-data.json', results.centralResult.data);
    }

    if (results.mergedResult?.success) {
      writeJSON('tests/output/merged-data.json', results.mergedResult.data);
    }

    // === Compare merged course set with old data ===
    if (results.mergedResult?.success) {

      const merged = new Set(Object.values(results.mergedResult.data).map(c => c.name));
      const data = new Set(Object.values(dataCourses).map(c => c.Course || c.name));

      const diff = (a, b) => [...a].filter(x => !b.has(x));

      const mergedNotData = diff(merged, data).sort();
      const dataNotMerged = diff(data, merged).sort();

      const comparison = {
        timestamp,
        totalMerged: merged.size,
        newInMerged: mergedNotData,
        missingFromMerged: dataNotMerged,
        newInMergedCount: mergedNotData.length,
        missingFromMergedCount: dataNotMerged.length
      };

      const comparisonFile = 'tests/output/course-diffs.json';
      if (!existsSync(comparisonFile)) {
        writeJSON(comparisonFile, comparison);
        console.log(`✅ Course comparison written to ${comparisonFile}`);
      }
      const namesFile = 'tests/output/merged-courses.json';
      if (!existsSync(namesFile)) {
        writeJSON(namesFile, merged);
        console.log(`✅ Merged course names written to ${namesFile}`);
      }
    }

    // Write summary
    const summary = {
      timestamp,
      hubSuccess: results.hubResult?.success || false,
      hubCourseCount: results.hubResult?.courseCount || 0,
      hubError: results.hubResult?.error || null,
      centralSuccess: results.centralResult?.success || false,
      centralCourseCount: results.centralResult?.courseCount || 0,
      centralError: results.centralResult?.error || null,
      mergedSuccess: results.mergedResult?.success || false,
      mergedCourseCount: results.mergedResult?.courseCount || 0,
      mergedError: results.mergedResult?.error || null
    };

    writeJSON('tests/output/summary.json', summary);
    console.log('\nResults written to tests/output/');

  } catch (error) {
    console.error('Test failed:', error);
    const errorResult = {
      timestamp,
      error: error.message,
      stack: error.stack
    };
    writeJSON('tests/output/error.json', errorResult);
  }
}

testFetch();
