import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClassesList = () => {
  return (
    <ListView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Manage your classes and create a new class from here.</p>
        <CreateButton resource="classes" />
      </div>

      <Card className="class-form-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient-orange">
            No classes page yet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The list view is still being built. Use the create button above to
            add a class now.
          </p>
        </CardContent>
      </Card>
    </ListView>
  );
};

export default ClassesList;
