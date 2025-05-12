'use client';

import React, { useMemo } from "react";
import Tree from "react-d3-tree";
import { PlayoffBracket, PlayoffSeries } from "@/app/types/leaguePlayoff";
import { useCenteredTree, convertBracketToTree } from "./helpers";
import SeriesCard from "./SeriesCard";

const containerStyles = {
  width: "768px", 
  height: "800px",
  border: "1px solid #444",
  borderRadius: "8px",
  overflow: "auto" 
};

const treeWrapperStyles = {
  width: "100%", 
  height: "100%",
};

interface LeaguePlayoffTreeProps {
  bracket: PlayoffBracket;
}

// Custom node renderer that uses the SeriesCard component
const renderCustomNode = ({ nodeDatum, toggleNode }: { nodeDatum: any; toggleNode: () => void }) => {
  const series: PlayoffSeries = nodeDatum.attributes?.series;
  
  if (!series) return null;
  
  if (!series.games && nodeDatum.attributes?.originalSeries?.games) {
    series.games = nodeDatum.attributes.originalSeries.games;
  }
  
  return (
    <g>
      <foreignObject width={400} height={240} x={-140} y={-100} onClick={toggleNode}>
        <div style={{ 
          height: '100%', 
          width: '100%', 
          cursor: 'pointer',
          transform: 'scale(0.85)'
        }}>
          <SeriesCard 
            series={series} 
            align="left" 
          />
        </div>
      </foreignObject>
    </g>
  );
};

export default function LeaguePlayoffTree({ bracket }: LeaguePlayoffTreeProps) {
  const [dimensions, _translate, containerRef] = useCenteredTree();  
  const treeData = useMemo(() => {  
    return convertBracketToTree(bracket);
  }, [bracket]);
  const initialTranslate = {
    x: (dimensions as { width: number; height: number }).width / 2.5,
    y: (dimensions as { width: number; height: number }).height / 2
  };
  
  return (
    <div style={containerStyles}>
      <div id="treeWrapper" style={treeWrapperStyles} ref={containerRef as React.LegacyRef<HTMLDivElement>}>
        <Tree
          data={treeData} 
          translate={initialTranslate}
          dimensions={dimensions as any}
          renderCustomNodeElement={renderCustomNode as any}
          orientation="horizontal"
          pathFunc="step"
          separation={{ siblings: 2.5, nonSiblings: 3 }}
          nodeSize={{ x: 350, y: 250 }}
          
          // These props help constrain the tree movement
          scaleExtent={{ min: 0.15, max: 2.0 }} 
          zoom={0.15} // Start at minimum zoom
          draggable={true}
          enableLegacyTransitions={false}
          transitionDuration={800} 
          depthFactor={220} 
        />
      </div>
    </div>
  );
}
