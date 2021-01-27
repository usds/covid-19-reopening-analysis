import React from "react";

import * as d3 from "d3";

// const geoState = require("./ga/geoState.json");
// const geoCounties = require("./ga/geoCounties.json");
let geoState = null;
let geoCounties = null;
try {
  geoState = require(`./geo/${process.env.REACT_APP_BASE_FIPS}_state.json`);
  geoCounties = require(`./geo/${process.env.REACT_APP_BASE_FIPS}_counties.json`);
} catch (e) {
  throw e;
}
class CountyMap extends React.Component {
  constructor(props) {
    super(props);
    const { width, height } = props;
    this.width = width || 500;
    this.height = height || 500;
  }
  componentDidMount() {
    if (!geoState) {
      return null;
    }
    const { counties } = this.props;

    const projection = d3
      .geoIdentity()
      .fitSize([this.width, this.height], geoState[0]);
    const projectionPath = d3.geoPath().projection(projection);
    // // Make our SVG responsive.
    this.svg.attr("viewBox", `0 0 ${this.width} ${this.height}`);
    this.svg.attr("preserveAspectRatio", "xMidYMid meet");
    this.svg.style("max-width", "100%").style("height", "auto");
    const { tooltip, tooltipText, tooltipCounty } = this;
    const g = this.svg.append("g");
    g.append("g")
      .attr("class", "states")
      .selectAll("path")
      .data(geoState)
      .join("path")
      .attr("class", "state")
      .attr("d", projectionPath)
      .attr("id", "state");

    g.append("clipPath")
      .attr("id", "clip-state")
      .append("use")
      .attr("xlink:href", "#state");

    // All counties.
    g.append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(geoCounties)
      .join("path")
      .attr("clip-path", "url(#clip-state)")
      .attr("class", d => {
        return (
          "county" +
          (counties[d.id]?.className ? "  " + counties[d.id].className : "")
        );
      })
      .attr("d", projectionPath)
      .on("click", function(d) {
        // onClick(d.id);
      })
      .on("mouseover", function(d) {
        this.classList.add("hovered");
        tooltipCounty.text(d.properties.name + " county" || "");
        tooltipText.text(counties[d.id]?.description || "");
        tooltip.style("display", "");
      })
      .on("mousemove", function() {
        tooltip
          .style("top", d3.event.pageY - 10 + "px")
          .style("left", d3.event.pageX + 10 + "px");
      })
      .on("mouseout", function() {
        this.classList.remove("hovered");
        tooltip.style("display", "none");
      });
  }
  render() {
    if (!geoState) {
      return null;
    }

    const { legend, legendLabel } = this.props;
    const legendItems = legend.map((e, i) => (
      <li key={i}>
        <span className={e.className}></span>
        {e.legendKey}
      </li>
    ));
    return (
      <div>
        <table
          className="c19-sr-graph-custom-tooltip tooltip"
          style={{ display: "none" }}
          ref={element => {
            return (this.tooltip = d3.select(element));
          }}
        >
          <thead>
            <tr>
              <th
                className="cell-date"
                ref={element => {
                  return (this.tooltipCounty = d3.select(element));
                }}
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                ref={element => {
                  return (this.tooltipText = d3.select(element));
                }}
              ></td>
            </tr>
          </tbody>
        </table>
        <svg
          className="map"
          width={this.width}
          height={this.height}
          ref={element => (this.svg = d3.select(element))}
        ></svg>
        <div className="map-legend">
          <div className="legend-title">{legendLabel || ""}</div>
          <div className="legend-scale">
            <ul className="legend-labels">{legendItems}</ul>
          </div>
        </div>
      </div>
    );
  }
}
export { CountyMap };
