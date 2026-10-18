<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name', 80);
            $table->string('category', 80);
            $table->unsignedTinyInteger('level')->default(80);
            $table->string('icon', 60)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['category', 'sort_order']);
        });

        DB::statement('ALTER TABLE skills ADD CONSTRAINT skills_level_check CHECK (level >= 0 and level <= 100)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
