'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Minus, Plus, GripVertical } from 'lucide-react';
import { Scene, Transition, ShowData } from '@/app/types';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_SCENE_DURATION = 30;
const DEFAULT_TRANSITION_DURATION = 10;

const EXAMPLE_DATA: ShowData = {
  scenes: [
    { id: '1', number: 1, name: 'Torche', duration: 30 },
    { id: '2', number: 2, name: 'Phoenix', duration: 45 },
    { id: '3', number: 3, name: 'Logo', duration: 60 },
  ],
  transitions: [
    { id: 't1', fromScene: '1', toScene: '2', duration: 12 },
    { id: 't2', fromScene: '2', toScene: '3', duration: 19 },
  ],
};

export default function ShowDurationCalculator() {
  const [showData, setShowData] = useState<ShowData>({
    scenes: [{ id: uuidv4(), number: 1, name: '', duration: DEFAULT_SCENE_DURATION }],
    transitions: [],
  });

  const addScene = (afterSceneId?: string) => {
    const newSceneId = uuidv4();
    const newScene: Scene = {
      id: newSceneId,
      number: showData.scenes.length + 1,
      name: '',
      duration: DEFAULT_SCENE_DURATION,
    };

    let newScenes: Scene[];
    let newTransitions = [...showData.transitions];

    if (afterSceneId) {
      const index = showData.scenes.findIndex((s) => s.id === afterSceneId);
      newScenes = [
        ...showData.scenes.slice(0, index + 1),
        newScene,
        ...showData.scenes.slice(index + 1),
      ].map((s, i) => ({ ...s, number: i + 1 }));
    } else {
      newScenes = [...showData.scenes, newScene];
    }

    if (showData.scenes.length > 0) {
      const previousSceneId = afterSceneId || showData.scenes[showData.scenes.length - 1].id;
      newTransitions.push({
        id: uuidv4(),
        fromScene: previousSceneId,
        toScene: newSceneId,
        duration: DEFAULT_TRANSITION_DURATION,
      });
    }

    setShowData({
      scenes: newScenes,
      transitions: newTransitions,
    });
  };

  const removeScene = (sceneId: string) => {
    const newScenes = showData.scenes
      .filter((s) => s.id !== sceneId)
      .map((s, i) => ({ ...s, number: i + 1 }));
    const newTransitions = showData.transitions.filter(
      (t) => t.fromScene !== sceneId && t.toScene !== sceneId
    );

    setShowData({
      scenes: newScenes,
      transitions: newTransitions,
    });
  };

  const updateScene = (sceneId: string, updates: Partial<Scene>) => {
    setShowData({
      ...showData,
      scenes: showData.scenes.map((s) =>
        s.id === sceneId ? { ...s, ...updates } : s
      ),
    });
  };

  const updateTransition = (transitionId: string, duration: number) => {
    setShowData({
      ...showData,
      transitions: showData.transitions.map((t) =>
        t.id === transitionId ? { ...t, duration } : t
      ),
    });
  };

  const resetShow = () => {
    setShowData({
      scenes: [{ id: uuidv4(), number: 1, name: '', duration: DEFAULT_SCENE_DURATION }],
      transitions: [],
    });
  };

  const loadExample = () => {
    setShowData(EXAMPLE_DATA);
  };

  const saveShow = () => {
    // In a real application, this would send data to a backend
    console.log('Saving show data:', showData);
  };

  const getTotalDuration = () => {
    const scenesDuration = showData.scenes.reduce((sum, scene) => sum + scene.duration, 0);
    const transitionsDuration = showData.transitions.reduce(
      (sum, transition) => sum + transition.duration,
      0
    );
    return { scenesDuration, transitionsDuration };
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const { scenesDuration, transitionsDuration } = getTotalDuration();
  const totalDuration = scenesDuration + transitionsDuration;

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="space-y-4">
          {showData.scenes.map((scene, index) => (
            <div key={scene.id}>
              <div className="flex items-center gap-4 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-grab"
                  title="Drag to reorder"
                >
                  <GripVertical className="h-4 w-4" />
                </Button>
                <div className="w-24">Scene {scene.number}</div>
                <Input
                  className="flex-1"
                  placeholder="Scene name"
                  value={scene.name}
                  onChange={(e) => updateScene(scene.id, { name: e.target.value })}
                />
                <Input
                  type="number"
                  className="w-24"
                  value={scene.duration}
                  onChange={(e) =>
                    updateScene(scene.id, { duration: parseInt(e.target.value) || 0 })
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => addScene(scene.id)}
                  title="Add scene after"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                {showData.scenes.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeScene(scene.id)}
                    title="Remove scene"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {index < showData.scenes.length - 1 && (
                <div className="flex items-center gap-4 ml-16 mb-2">
                  <div className="w-24">
                    TR {scene.name || `Scene ${scene.number}`} &gt;{' '}
                    {showData.scenes[index + 1].name ||
                      `Scene ${showData.scenes[index + 1].number}`}
                  </div>
                  <div className="flex-1" />
                  <Input
                    type="number"
                    className="w-24"
                    value={
                      showData.transitions.find((t) => t.fromScene === scene.id)?.duration ||
                      DEFAULT_TRANSITION_DURATION
                    }
                    onChange={(e) => {
                      const transition = showData.transitions.find(
                        (t) => t.fromScene === scene.id
                      );
                      if (transition) {
                        updateTransition(transition.id, parseInt(e.target.value) || 0);
                      }
                    }}
                  />
                  <div className="w-20" /> {/* Spacer for alignment */}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-muted-foreground">Total Duration</div>
            <div className="text-2xl font-bold">{formatDuration(totalDuration)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Scenes Duration</div>
            <div className="text-2xl font-bold">{formatDuration(scenesDuration)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Transitions Duration</div>
            <div className="text-2xl font-bold">{formatDuration(transitionsDuration)}</div>
          </div>
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={resetShow}>
          Reset
        </Button>
        <Button variant="outline" onClick={loadExample}>
          Load Example
        </Button>
        <Button onClick={saveShow}>Save</Button>
      </div>
    </div>
  );
}