import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Save,
  FileUp,
  Download,
  Trash2,
  GitBranch,
  Plus,
  Layout,
  ChevronDown,
  Square,
  Circle,
  Diamond,
  Zap,
  Sparkles,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface FlowNavbarProps {
  onSave: () => void;
  onLoad: (file: File) => void;
  onClear: () => void;
  onExport: () => void;
  onAddNode: (nodeType: 'box' | 'circle' | 'diamond' | 'conditional') => void;
  onAutoLayout: (layoutType: 'horizontal' | 'vertical' | 'tree') => void;
  currentEdgeType: 'bezier' | 'step' | 'smoothstep' | 'straight';
  onEdgeTypeChange: (type: 'bezier' | 'step' | 'smoothstep' | 'straight') => void;
  edgeAnimated: boolean;
  onEdgeAnimatedChange: (animated: boolean) => void;
}

const FlowNavbar = ({
  onSave,
  onLoad,
  onClear,
  onExport,
  onAddNode,
  onAutoLayout,
  currentEdgeType,
  onEdgeTypeChange,
  edgeAnimated,
  onEdgeAnimatedChange,
}: FlowNavbarProps) => {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onLoad(file);
      toast({
        title: "Flow Imported",
        description: "Flow has been successfully imported.",
      });
    }
  };

  return (
    <nav className="h-16 border-b bg-card shadow-soft flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">FlowBuilder</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Add Node Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Node
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onAddNode('box')}>
              <Square className="w-4 h-4 mr-2" />
              Box Node
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddNode('circle')}>
              <Circle className="w-4 h-4 mr-2" />
              Circle Node
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddNode('diamond')}>
              <Diamond className="w-4 h-4 mr-2" />
              Diamond Node
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddNode('conditional')}>
              <GitBranch className="w-4 h-4 mr-2" />
              If/Else Node
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Auto Layout Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Layout className="w-4 h-4" />
              Auto Layout
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onAutoLayout('horizontal')}>
              Horizontal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAutoLayout('vertical')}>
              Vertical
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAutoLayout('tree')}>
              Tree Structure
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Edge Type Controls */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Zap className="w-4 h-4" />
              Edge Type
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdgeTypeChange('bezier')}>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 flex items-center">
                  {currentEdgeType === 'bezier' && <div className="w-2 h-2 bg-primary rounded-full" />}
                </div>
                Bezier (Curved)
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdgeTypeChange('straight')}>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 flex items-center">
                  {currentEdgeType === 'straight' && <div className="w-2 h-2 bg-primary rounded-full" />}
                </div>
                Straight
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdgeTypeChange('step')}>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 flex items-center">
                  {currentEdgeType === 'step' && <div className="w-2 h-2 bg-primary rounded-full" />}
                </div>
                Step
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdgeTypeChange('smoothstep')}>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 flex items-center">
                  {currentEdgeType === 'smoothstep' && <div className="w-2 h-2 bg-primary rounded-full" />}
                </div>
                Smooth Step
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Edge Animation Toggle */}
        <Button
          variant={edgeAnimated ? "default" : "outline"}
          size="sm"
          onClick={() => onEdgeAnimatedChange(!edgeAnimated)}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {edgeAnimated ? 'Animated' : 'Static'}
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        {/* File Operations */}
        <Button variant="outline" size="sm" onClick={onSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>

        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="outline" size="sm" className="gap-2 pointer-events-none">
            <FileUp className="w-4 h-4" />
            Import
          </Button>
        </div>

        <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>

        <Button variant="destructive" size="sm" onClick={onClear} className="gap-2">
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
      </div>
    </nav>
  );
};

export default FlowNavbar;