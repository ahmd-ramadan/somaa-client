"use client";

import React from 'react';
import { IMonitorResult, PlatformsNamesEnum } from './types';
import HierarchicalGroupView from './HierarchicalGroupView';

interface ListViewProps {
	results: IMonitorResult[];
	groupBy: string[];
	locale: string;
	renderEmbdedPlatforms: (result: IMonitorResult) => React.ReactNode;
	renderHoverButtons: (postIndex: number) => React.ReactNode;
	onHoverPost: (index: number | null) => void;
	hoveredPost: number | null;
	allowedEmbededPlatforms: PlatformsNamesEnum[];
	shuffle: (arr: IMonitorResult[]) => IMonitorResult[];
	selectedResults: Set<string>;
	onSelectResult: (resultId: string, selected: boolean) => void;
	onSelectAllInGroup: (results: IMonitorResult[], selected: boolean) => void;
	selectionMode: boolean;
	listDensity: 'compact' | 'comfortable';
}

export default function ListView(props: ListViewProps) {
	return (
		<HierarchicalGroupView
			results={props.results}
			groupBy={props.groupBy}
			viewMode={'list'}
			locale={props.locale}
			renderEmbdedPlatforms={props.renderEmbdedPlatforms}
			renderHoverButtons={props.renderHoverButtons}
			onHoverPost={props.onHoverPost}
			hoveredPost={props.hoveredPost}
			allowedEmbededPlatforms={props.allowedEmbededPlatforms}
			shuffle={props.shuffle}
			selectedResults={props.selectedResults}
			onSelectResult={props.onSelectResult}
			onSelectAllInGroup={props.onSelectAllInGroup}
			selectionMode={props.selectionMode}
			gridColumns={3}
			listDensity={props.listDensity}
		/>
	);
} 