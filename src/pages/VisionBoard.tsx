import { Layout } from "@/components/Layout";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Trash2, Edit, ImageIcon } from "lucide-react";

const VisionBoard = () => {
  const visionCards = useAppStore((state) => state.visionCards);
  const addVisionCard = useAppStore((state) => state.addVisionCard);
  const updateVisionCard = useAppStore((state) => state.updateVisionCard);
  const deleteVisionCard = useAppStore((state) => state.deleteVisionCard);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;

    addVisionCard({
      title,
      description,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    });

    setTitle("");
    setDescription("");
    setImageUrl("");
    setIsAddOpen(false);
  };

  const handleEdit = (cardId: string) => {
    const card = visionCards.find((c) => c.id === cardId);
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
      setImageUrl(card.imageUrl);
      setEditingCard(cardId);
    }
  };

  const handleUpdate = () => {
    if (!editingCard || !title.trim()) return;

    updateVisionCard(editingCard, {
      title,
      description,
      imageUrl,
    });

    setTitle("");
    setDescription("");
    setImageUrl("");
    setEditingCard(null);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setEditingCard(null);
  };

  return (
    <Layout>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">Vision Board</h1>
              <p className="text-muted-foreground mt-1">Visualize your goals and dreams</p>
            </div>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground shadow-glow">
                <Plus className="w-4 h-4 mr-2" />
                Add Vision Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Vision Card</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="e.g., Complete Marathon"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your goal..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image URL (optional)</Label>
                  <Input
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                <Button onClick={handleAdd} className="w-full">
                  Create Card
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vision Cards Grid */}
        {visionCards.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No vision cards yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your vision board by adding your goals and aspirations
              </p>
              <Button onClick={() => setIsAddOpen(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Card
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visionCards.map((card) => (
              <Card key={card.id} className="shadow-card hover:shadow-glow transition-smooth overflow-hidden group">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => handleEdit(card.id)}
                          className="w-8 h-8"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Vision Card</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              placeholder="e.g., Complete Marathon"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              placeholder="Describe your goal..."
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input
                              placeholder="https://..."
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button onClick={handleUpdate} className="flex-1">
                              Update Card
                            </Button>
                            <Button onClick={resetForm} variant="outline">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteVisionCard(card.id)}
                      className="w-8 h-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-foreground mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VisionBoard;
