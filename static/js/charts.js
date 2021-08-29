function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// BAR AND BUBBLE CHARTS
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samplesArray = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var filterArray = samplesArray.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata;
    var metadataFilter = metadataArray.filter(sampleObj => sampleObj.id == sample);
    //console.log(metadataFilter);

    // Create a variable that holds the first sample in the samples array.
    var firstResult = filterArray[0];
    //console.log(firstResult);

    // Create a variable that holds the first sample in the metadata array.
    var metadataSample = metadataFilter[0];
    //console.log(metadataSample);

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstResult.otu_ids;
    var otuLabels = firstResult.otu_labels;
    var sampleValues = firstResult.sample_values;
    //console.log(sampleValues);

    // Create a variable that holds the washing frequency.
    var washFreq = metadataSample.wfreq;
    //console.log(washFreq);

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var topOtuIds = otuIds.slice(0, 10).map(otuid => `OTU ${otuid}`).reverse();
    //console.log(topOtuIds);

    var yticks = topOtuIds;

    // BAR CHART
    // Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: sampleValues.slice(0, 10).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    // Create the layout for the bar chart. 
    var barLayout = {
     title: { text: 'Top 10 Bacteria Cultures Found',
              font: {size: 25}
              },
     xaxis: {title: 'Sample Values'},
     margin: {t: 50},
     font: {color: '#550A35', family: 'Arial, Helvetica, sans-serif'}
    };

    // Use Plotly to plot the bar graph data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    // BUBBLE CHART
    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Bluered'}
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: { text: 'Bacteria Cultures Per Sample',
               font: {size: 25}
              },
      font: {style: 'bold'},
      xaxis: {title: 'OTU IDs'},
      yaxis: {title: 'Sample Values'},
      hovermode: 'closest',
      showlegend: false,
      margin: {t: 50},
      font: {color: '#550A35', family: 'Arial, Helvetica, sans-serif'}
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

    // GAUGE CHART
    // Create the trace for the gauge chart.
    var gaugeData = [{
      value: washFreq,
      type: 'indicator',
      mode: 'gauge+number',
      title: { text: "Belly Button Washing Frequency<br> Scrubs per Week",
               font: {size: 25}
              },
      font: {style: 'bold'},
      gauge: {
        axis: {range: [0, 10]},
        steps: [
          {range: [0, 2], color: 'red'},
          {range: [2, 4], color: 'darkorange'},
          {range: [4, 6], color: 'yellow'},
          {range: [6, 8], color: 'yellowgreen'},
          {range: [8, 10], color: 'green'}
        ],
        bar: {color: 'black'}
      }
    }];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 350,
      margin: {l: 50},
      font: {color: '#550A35', family: 'Arial, Helvetica, sans-serif'}
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}
